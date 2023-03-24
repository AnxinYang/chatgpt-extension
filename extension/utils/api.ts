import { generateMessages } from "./prompt";

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

const apiEndpoint = "http://localhost:8000/api/chat";

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

export const getChatCompletion = async (
  message: string,
  onMessage: (message: string) => void
): Promise<void> => {
  try {
    const messages = generateMessages(message);
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });
    if (response.status === 429) {
      onMessage("Too many requests, please try again later.");
    }
    if (!response.body) throw new Error("No response body");

    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const message = readMessagesFromStreamData(value);
      onMessage(message);
    }
  } catch (e) {
    console.error(e);
    onMessage("Sorry, something went wrong.");
  }
};
