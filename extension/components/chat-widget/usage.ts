import { applyCSStoElement } from "./styles";
import { ChatGPTWidget } from "./widget";

export function tokenUsageRender(widget: ChatGPTWidget) {
  const container = document.createElement("div");

  container.textContent = `Memory: ${widget.historyManager.getTokenUsageInPercentage()}`;
  applyCSStoElement(container, {
    width: "fit-content",
    "border-radius": "12px",
    "background-color": "rgb(64, 65, 79)",
    padding: "0.25em 12px",
    "font-size": "8px",
    color: "white",
  });

  return container;
}
