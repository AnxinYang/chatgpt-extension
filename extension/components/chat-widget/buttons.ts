export interface ButtonsRenderDeps {
  toggleHandler: (e: MouseEvent) => void;
  closeHandler: (e: MouseEvent) => void;
}
export function buttonsRenderProvider({
  toggleHandler,
  closeHandler,
}: ButtonsRenderDeps): () => HTMLElement {
  return () => {
    const container = document.createElement("div");

    const toggleButton = document.createElement("button");
    toggleButton.setAttribute("id", "chatgpt-toggle-button");
    toggleButton.textContent = "+";
    toggleButton.addEventListener("click", toggleHandler);

    const closeButton = document.createElement("button");
    closeButton.setAttribute("id", "chatgpt-close-button");
    closeButton.textContent = "X";
    closeButton.addEventListener("click", closeHandler);

    container.appendChild(toggleButton);
    container.appendChild(closeButton);

    return container;
  };
}
