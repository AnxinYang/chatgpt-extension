export interface Message {
  role: Role;
  content: string;
}
export type Role = "user" | "assistant" | "system";
export interface ClientMessage {
  role: Role;
  content: string;
  tokenUsage: number;
}
