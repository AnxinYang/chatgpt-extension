export type Role = "user" | "assistant" | "system";
export interface Message {
  role: Role;
  content: string;
  tokenUsage: number;
}

export interface TokenizedString {
  encode: {
    bpe: number[];
    text: string[];
  };
  decode: string;
}
