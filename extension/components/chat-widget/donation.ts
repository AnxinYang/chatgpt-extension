import { applyCSStoElement } from "./styles";
import { ChatGPTWidget } from "./widget";

export function donationInfoRender(widget: ChatGPTWidget) {
  const container = document.createElement("a");
  applyCSStoElement(container, {
    display: "block",
    color: "white",
    "text-decoration": "underline",
    "margin-top": "8px",
    "font-size": "12px",
    "text-align": "right",
  });
  container.setAttribute("href", "https://www.buymeacoffee.com/anxinyang1e");
  container.setAttribute("target", "_blank");
  container.textContent = "Buy me a coffee.";

  return container;
}
