import { buttonsRenderProvider } from "./buttons";
import { containerRenderProvider } from "./container";
import { conversationRenderProvider } from "./conversation";
import { inputRenderProvider } from "./input";
import { messageRender } from "./message";
import { ChatGPTResponse } from "./response";
import {
  addConversationHandler,
  addConversationEventHandlerProvider,
  submitEventHandlerProvider,
  submitHandler,
  toggleButtonHandler,
  toggleEventHandler,
} from "./utils";
import { ChatGPTWidget } from "./widget";

// Create the custom element
const chatWidget = new ChatGPTWidget({
  containerRender: containerRenderProvider({}),
  buttonsRender: buttonsRenderProvider({
    toggleHandler: toggleButtonHandler,
    closeHandler: () => {},
  }),
  conversationRender: conversationRenderProvider({
    addConversationEventHandler: addConversationEventHandlerProvider({
      messageRender,
    }),
  }),
  inputRender: inputRenderProvider({
    submitHandler,
    addConversationHandler,
  }),
  submitEventHandler: submitEventHandlerProvider({
    messageRender,
  }),
  toggleEventHandler,
});

export { chatWidget };
