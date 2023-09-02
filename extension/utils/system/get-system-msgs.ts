import { Message } from "utils/types";
import { getStringTokenSize } from "./get-tokenized-string";

const systemPrompts = [
  "You are a charming AI assistant that help people read webpage.",
  "If the information is not available on page, use the best of your knowledge to answer.",
  "Always answer in the last language that the user used in prompt.",
];

const getSystemMsgs = (): Message[] => {
  const messages: Message[] = systemPrompts.map((prompt) => ({
    role: "system",
    content: prompt,
    tokenUsage: getStringTokenSize(prompt),
  }));

  return messages;
};

export { getSystemMsgs };
