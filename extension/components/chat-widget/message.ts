export function messageRender(content: string, isUser: boolean): HTMLElement {
  const container = document.createElement("div");
  container.setAttribute("data-role", isUser ? "user" : "assistant");
  container.setAttribute("data-token-usage", "0");
  container.innerText = content;
  return container;
}
