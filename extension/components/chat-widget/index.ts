import { buttonsRenderProvider } from "./buttons";
import { containerRenderProvider } from "./container";
import { conversationRenderProvider } from "./conversation";
import { inputRenderProvider } from "./input";
import { messageRender } from "./message";
import { ChatGPTResponse } from "./response";
import {
  addConversationHandler,
  addConversationEventHandlerProvider,
  submitEventHandler,
  submitHandler,
  toggleButtonHandler,
  toggleEventHandler,
} from "./utils";
import { ChatGPTWidget } from "./widget";

// Create the custom element
const chatWidget = new ChatGPTWidget({
  containerRender: containerRenderProvider({
    toggleEventHandler,
  }),
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
});

export { chatWidget };
