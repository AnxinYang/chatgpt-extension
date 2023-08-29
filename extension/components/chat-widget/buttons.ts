import { applyCSStoElement } from "./styles";

export interface ButtonsRenderDeps {
  toggleHandler: (e: MouseEvent) => void;
  closeHandler: (e: MouseEvent) => void;
}

const commonButtonStyle = {
  "box-sizing": "border-box",
  width: "24px",
  height: "24px",
  "text-align": "center",
  cursor: "pointer",
  border: "none",
  color: "white",
  background: "#6e6e80",
  "border-radius": "12px",
};

export function buttonsRenderProvider({
  toggleHandler,
  closeHandler,
}: ButtonsRenderDeps): () => HTMLElement {
  return () => {
    const container = document.createElement("div");
    container.style.cssText = `
      display: flex;
      width: 100%;
      gap: 4px;
      justify-content: flex-end;
    `;

    const toggleButton = document.createElement("button");
    applyCSStoElement(toggleButton, commonButtonStyle);
    toggleButton.textContent = "+";
    toggleButton.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleHandler(e);
      if (toggleButton.textContent === "+") {
        toggleButton.textContent = "-";
      } else {
        toggleButton.textContent = "+";
      }
    });

    const closeButton = document.createElement("button");
    applyCSStoElement(closeButton, {
      ...commonButtonStyle,
      background: "rgb(141, 44, 44)",
    });
    closeButton.textContent = "X";
    closeButton.addEventListener("click", closeHandler);

    container.appendChild(toggleButton);
    container.appendChild(closeButton);

    return container;
  };
}
