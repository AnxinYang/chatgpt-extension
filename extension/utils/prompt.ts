import { getChatSummary } from "./api";
import { getPageContent } from "./page/get-page-content";
import { getSystemMsgs } from "./system/get-system-msgs";
import { getTokenizedString } from "./system/get-tokenized-string";
import { Message } from "./types";

let history: Message[] = [];

export const addToHistory = (
  message: string,
  role: "user" | "assistant"
): void => {
  history.push({
    role,
    content: message,
    tokenUsage: getTokenizedString(message).encode.bpe.length,
  });

  const tokenUsage = history.reduce((acc, curr) => acc + curr.tokenUsage, 0);
  if (tokenUsage > 2000) {
    getChatSummary(history)
      .then((summary) => {
        const prompt = `Here is a summary of the conversation so far: ${summary}`;
        history = [
          {
            role: "system",
            content: prompt,
            tokenUsage: getTokenizedString(prompt).encode.bpe.length,
          },
        ];
      })
      .catch((error) => {
        console.log("Failed to get summary", error);
        history.shift();
      });
  }
  console.log("tokenUsage", tokenUsage);
  console.log("history", history);
};

export const clearHistory = (): void => {
  history = [];
};

export const generateMessages = (prompt: string): Message[] => {
  const messages: Message[] = [
    ...getSystemMsgs(),
    getPageContent(),
    ...history,
    {
      role: "user",
      content: prompt,
      tokenUsage: getTokenizedString(prompt).encode.bpe.length,
    },
  ];
  return messages;
};
export { Message };
