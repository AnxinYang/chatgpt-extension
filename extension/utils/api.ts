import { generateMessage } from "history/message";
import { getStringTokenSize } from "./system/get-tokenized-string";
import { Message } from "./types";

export interface ChatGPTChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: [
    {
      delta: {
        content?: string;
      };
      index: 0;
      finish_reason: "stop" | null;
    }
  ];
}

const apiEndpoint = "https://chatgpt-extension.deno.dev/api/chat";
const apiEndpointSummary = "https://chatgpt-extension.deno.dev/api/summary";

const parseMessageJson = (json: string): ChatGPTChunk | null => {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

const readStringFromChunkString = (chunkString: string) => {
  return chunkString.replace("data:", "").replaceAll("\n", "").trim();
};

const readMessagesFromStreamData = (data: string): string => {
  const chunkStrings = data.split("\n\n");
  let result = "";
  chunkStrings.forEach((chunkString) => {
    const json = readStringFromChunkString(chunkString);
    const chunk = parseMessageJson(json);
    if (!chunk) return;
    const message = chunk.choices[0].delta.content;
    if (!message) return;
    result += message;
  });

  return result;
};

const requestChatCompletion = async (
  messages: Message[],
  onMessage: (message: string) => void
): Promise<Message> => {
  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Content-Encode": "gzip",
    },
    body: JSON.stringify({ messages }),
  });
  if (response.status === 429) {
    throw new Error("Too many requests, please try again later.");
  }
  if (!response.body) throw new Error("Sorry, something went wrong.");

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

  let newMessage = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const message = readMessagesFromStreamData(value);
    newMessage += message;
    onMessage(message);
  }

  return generateMessage(
    "assistant",
    newMessage,
    getStringTokenSize(newMessage)
  );
};

export const getChatCompletion = async (
  messages: Message[],
  onMessage: (message: string) => void
): Promise<Message> => {
  return await requestChatCompletion(messages, onMessage);
};

// Get Chat Summary

export const getChatSummary = async (
  messages: Message[]
): Promise<string | void> => {
  const response = await fetch(apiEndpointSummary, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Content-Encode": "gzip",
    },
    body: JSON.stringify({ messages }),
  });
  if (response.status === 429) {
    console.error("Too many requests, please try again later.");
  }
  if (!response.body) throw new Error("No response body");
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let json = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      return JSON.parse(json).choices[0].message.content;
    }
    json += value;
  }
};
