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

export const getChatCompletion = async (
  message: string,
  onData: (data: string) => void
): Promise<void> => {
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

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const data = value.split("\n\n");

      data.forEach((d) => {
        try {
          const json = d.replace("data:", "").replaceAll("\n", "").trim();
          const chunk: ChatGPTChunk = JSON.parse(json);
          if (!chunk.choices[0].delta.content) return;
          onData(chunk.choices[0].delta.content);
        } catch (e) {}
      });
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
