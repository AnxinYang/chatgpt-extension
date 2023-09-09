import { Message } from "utils/types";

export function messageRender({ role, content }: Message): HTMLElement {
  const container = document.createElement("div");
  const isUser = role === "user";

  container.innerText = content;
  container.style.cssText = `
    padding: 0.5em 12px;
    margin: 0.75em 0;
    border-radius: 12px;
    background-color: ${isUser ? "#4285f4" : "#ccc"};
    color: ${isUser ? "#ffffff" : "#000000"};
    white-space: pre-wrap;
    overflow-wrap: break-word;
  `;

  const animation = container.animate(
    [
      { opacity: 0, transform: "translateX(10px)" },
      { opacity: 1, transform: "translateX(0px)" },
    ],
    {
      duration: 200,
    }
  );

  return container;
}
