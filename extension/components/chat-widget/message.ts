export function messageRender(content: string, isUser: boolean): HTMLElement {
  const container = document.createElement("div");
  container.setAttribute("data-role", isUser ? "user" : "assistant");
  container.setAttribute("data-token-usage", "0");
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
