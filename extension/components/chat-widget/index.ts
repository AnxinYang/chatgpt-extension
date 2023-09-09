import { ChatHistoryManager } from "history";
import { buttonsRenderProvider } from "./buttons";
import { containerRenderProvider } from "./container";
import { conversationRenderProvider } from "./conversation";
import { inputRenderProvider } from "./input";
import { messageRender } from "./message";
import { toggleAnimater } from "./utils";
import { ChatGPTWidget } from "./widget";
import { MAX_MEMORY_TOKENS } from "utils/constants";
import { getStringTokenSize } from "utils/system/get-tokenized-string";
import { getChatCompletion } from "utils/api";
import { getSystemMsgs } from "utils/system/get-system-msgs";
import { getPageContent } from "utils/page/get-page-content";
import { tokenUsageRender } from "./usage";
import { donationInfoRender } from "./donation";
import { retryButtonRender } from "./retry";

// Create the custom element
const chatWidget = new ChatGPTWidget({
  containerRender: containerRenderProvider({}),
  buttonsRender: buttonsRenderProvider({}),
  conversationRender: conversationRenderProvider({}),
  retryButtonRender,
  inputRender: inputRenderProvider({}),
  messageRender,
  tokenUsageRender,
  donationInfoRender,
  toggleAnimater,
  tokenCounter: getStringTokenSize,
  chatResponseStreamer: async (messages, onMessage) =>
    await getChatCompletion(messages, onMessage),
  systemMessages: getSystemMsgs(),
  pageContent: getPageContent(),
  historyManager: new ChatHistoryManager({
    tokenLimit: MAX_MEMORY_TOKENS,
    historySummrizer: async (history) => {
      return {
        role: "system",
        content: "Summary",
        tokenUsage: 1,
      };
    },
  }),
});

export { chatWidget };
