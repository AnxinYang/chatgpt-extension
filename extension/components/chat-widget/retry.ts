import { applyCSStoElement } from "./styles";
import { ChatGPTWidget } from "./widget";

export interface RetryButtonDeps {}

const commonButtonStyle = {
  "box-sizing": "border-box",
  "text-align": "center",
  padding: "0.5em 12px",
  margin: "0.75em 0",
  "margin-top": "0",
  cursor: "pointer",
  border: "none",
  color: "white",
  background: "rgb(64, 65, 79)",
  "border-radius": "12px",
};

export function retryButtonRender(widget: ChatGPTWidget) {
  const container = document.createElement("div");
  applyCSStoElement(container, {
    "text-align": "center",
    display: "none",
  });

  const retryButton = document.createElement("button");
  applyCSStoElement(retryButton, commonButtonStyle);
  retryButton.textContent = "Retry";

  retryButton.addEventListener("click", () => {
    widget.retry();
  });

  container.appendChild(retryButton);
  return container;
}
