import "@webcomponents/webcomponentsjs";
import { ChatGPTWidget } from "./components/widget";
import "./components/input";
import "./components/response";
import "./components/message";
import { ChatGPTResponse } from "./components/response";
import { ChatGPTInput } from "./components/input";

// Create the custom element
const widget = new ChatGPTWidget();

const response = new ChatGPTResponse();
const input = new ChatGPTInput();
input.setOutputTarget(response);

widget.appendComponent(response);
widget.appendComponent(input);

// Add the custom element to the DOM
document.body.appendChild(widget);
