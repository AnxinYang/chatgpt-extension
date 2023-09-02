import { applyCSStoElement } from "./styles";
import { ChatGPTWidget } from "./widget";

export interface InputRenderDeps {}

const inputContainerStyle = {
  display: "flex",
  width: "100%",
  "align-items": " center",
  "justify-content": "space-between",
  "background-color": "rgb(64, 65, 79)",
  "border-radius": "12px",
  "margin-bottom": "0.25em",
};

const inputStyle = {
  width: "100%",
  padding: "0.5em 12px",
  "border-radius": "12px",
  color: "rgb(255, 255, 255)",
  "background-color": "transparent",
  border: "none",
  outline: "none",
};

export function inputRenderProvider({}: InputRenderDeps) {
  return (widget: ChatGPTWidget) => {
    const container = document.createElement("div");
    applyCSStoElement(container, inputContainerStyle);

    const input = document.createElement("input");
    applyCSStoElement(input, inputStyle);
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Type a message...");
    input.setAttribute("autocomplete", "off");
    input.addEventListener("keydown", (event) => {
      event.stopPropagation();
      if (event.key === "Enter") {
        event.preventDefault();
        widget.handleUserInput(input.value);
        input.value = "";
      }
    });

    container.appendChild(input);

    return container;
  };
}
