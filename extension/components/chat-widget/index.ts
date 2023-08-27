import { buttonsRenderProvider } from "./buttons";
import { containerRenderProvider } from "./container";
import { conversationRenderProvider } from "./conversation";
import { inputRenderProvider } from "./input";
import { ChatGPTResponse } from "./response";
import {
  addConversationHandler,
  addConversationEventHandler,
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
    addConversationEventHandler,
  }),
  inputRender: inputRenderProvider({
    submitHandler,
    addConversationHandler,
  }),
});

export { chatWidget };
