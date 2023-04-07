import { Message, Role, TokenizedString } from "utils/types";
import Tokenizer from "gpt3-tokenizer";

const getTokenizedString = (message: string): TokenizedString => {
  const tokenizer = new Tokenizer({ type: "gpt3" });
  const encode = tokenizer.encode(message);
  const decode = tokenizer.decode(encode.bpe);
  return {
    encode,
    decode,
  };
};

const getStringTokenSize = (message: string): number => {
  const tokenizer = new Tokenizer({ type: "gpt3" });
  const encode = tokenizer.encode(message);
  return encode.bpe.length;
};

export { getTokenizedString, getStringTokenSize };
