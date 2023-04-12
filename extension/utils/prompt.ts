import { getChatSummary } from "./api";
import { MAX_MEMORY_TOKENS } from "./constants";
import { getPageContent } from "./page/get-page-content";
import { getSystemMsgs } from "./system/get-system-msgs";
import { getStringTokenSize } from "./system/get-tokenized-string";
import { Message } from "./types";

let history: Message[] = [];

export const getCurrentTokenUsage = (): number => {
  return history.reduce((acc, curr) => acc + curr.tokenUsage, 0);
};

export const addToHistory = async (
  message: string,
  role: "user" | "assistant"
): Promise<void> => {
  history.push({
    role,
    content: message,
    tokenUsage: getStringTokenSize(message),
  });

  const tokenUsage = getCurrentTokenUsage();
  if (tokenUsage > MAX_MEMORY_TOKENS) {
    try {
      const summary = await getChatSummary(history);
      const prompt = `Here is a summary of the conversation so far: ${summary}`;
      history = [
        {
          role: "system",
          content: prompt,
          tokenUsage: getStringTokenSize(prompt),
        },
      ];
    } catch (error) {
      console.log("Failed to get summary", error);
      history.shift();
    }
  }
  console.log("tokenUsage", tokenUsage);
  console.log("history", history);
};

export const clearHistory = (): void => {
  history = [];
};

export const deleteLastMessage = (): void => {
  history.pop();
};

export const generateMessages = (prompt: string): Message[] => {
  const messages: Message[] = [
    ...getSystemMsgs(),
    getPageContent(),
    ...history,
    {
      role: "user",
      content: prompt,
      tokenUsage: getStringTokenSize(prompt),
    },
  ];
  return messages;
};

export const generateRetryMessages = (): Message[] => {
  deleteLastMessage();
  const messages: Message[] = [
    ...getSystemMsgs(),
    getPageContent(),
    ...history,
  ];
  return messages;
};

export { Message };
