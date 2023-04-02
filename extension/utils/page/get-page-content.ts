import { Message } from "utils/types";
import Tokenizer from "gpt3-tokenizer";
import { deduplicateDecode } from "utils/system/deduplicate-decode";

const getPageContent = (): Message => {
  const bodyContent = document.body.innerText;
  if (!bodyContent)
    return {
      role: "system",
      content: `This page has no content.`,
      tokenUsage: 0,
    };
  const tokenizer = new Tokenizer({ type: "gpt3" });
  const encode = tokenizer.encode(bodyContent);
  const decode = tokenizer.decode(encode.bpe);
  const deduped = deduplicateDecode(decode);
  const dedupedEncode = tokenizer.encode(deduped);
  if (dedupedEncode.bpe.length < 1500) {
    return {
      role: "system",
      content: `This page has the following content: ${deduped}`,
      tokenUsage: dedupedEncode.bpe.length,
    };
  }

  const dedupedEncodeTruncated = dedupedEncode.bpe.slice(0, 1500);
  const dedupedTruncated = tokenizer.decode(dedupedEncodeTruncated);
  return {
    role: "system",
    content: `This page has the following content: ${dedupedTruncated}`,
    tokenUsage: dedupedEncodeTruncated.length,
  };
};

export { getPageContent };
