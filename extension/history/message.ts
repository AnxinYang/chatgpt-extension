import { Message, Role } from "utils/types";

// generate a message
export function generateMessage(
  role: Role,
  content: string,
  tokenUsage: number
): Message {
  return { role, content, tokenUsage };
}
