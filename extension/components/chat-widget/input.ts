export interface InputRenderDeps {
  submitHandler: (input: string) => void;
  addConversationHandler: (
    this: HTMLElement,
    str: string,
    isUser?: boolean
  ) => void;
}

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
    const input = document.createElement("input");
    input.setAttribute("id", "chatgpt-input");
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
