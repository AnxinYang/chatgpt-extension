import { generateMessages } from "./prompt";

export const getChatCompletion = async (
  message: string
): Promise<ReadableStreamDefaultReader<string>> => {
  // Send the input to the Deno server and display the response
  try {
    const messages = generateMessages(message);
    const response = await fetch("http://localhost:8000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });
    if (!response.body) throw new Error("No response body");
    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();

    return reader;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
