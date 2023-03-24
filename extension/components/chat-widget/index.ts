import { ChatGPTInput } from "./input";
import { ChatGPTResponse } from "./response";
import { ChatGPTWidget } from "./widget";

// Create the custom element
const chatWidget = new ChatGPTWidget();
const response = new ChatGPTResponse();
const input = new ChatGPTInput();
input.setOutputTarget(response);
chatWidget.appendComponent(response);
chatWidget.appendComponent(input);

export { chatWidget };
