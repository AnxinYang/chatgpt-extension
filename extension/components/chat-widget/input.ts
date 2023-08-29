import { applyCSStoElement } from "./styles";

export interface InputRenderDeps {
  submitHandler: (input: string) => void;
  addConversationHandler: (
    this: HTMLElement,
    str: string,
    isUser?: boolean
  ) => void;
}

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

export function inputRenderProvider({
  submitHandler,
  addConversationHandler,
}: InputRenderDeps) {
  const doSubmit = (input: HTMLInputElement) => {
    addConversationHandler.call(input, input.value, true);
    submitHandler.call(input, input.value);
    input.value = "";
  };

  return () => {
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
        doSubmit(input);
      }
    });

    container.appendChild(input);

    return container;
  };
}
