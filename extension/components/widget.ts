import { clearHistory } from "utils/prompt";
import { ChatGPTResponse } from "./response";

export class ChatGPTWidget extends HTMLElement {
  readonly container = document.createElement("div");
  readonly contents = document.createElement("div");
  readonly buttons = document.createElement("div");

  constructor(
    options: { position?: string; color?: string; size?: string } = {}
  ) {
    super();

    // Attach a shadow root to the custom element
    this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
      * {
        box-sizing: border-box;
      }
      #chatgpt-container[data-hidden="true"] #chatgpt-contents{
        display: none;
      }
      #chatgpt-container[data-hidden="true"] #clear-button{
        display: none;
      }
      #chatgpt-container {
        position: ${options.position ?? "fixed"};
        bottom: 20px;
        right: 20px;
        width: ${options.size ?? "fit-content"};
        height: ${options.size ?? "fit-content"};
        background-color: ${options.color ?? "#353740"};
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        padding: 10px;
        z-index: 9999;
      }
    `;
    if (!this.shadowRoot) return;
    this.shadowRoot.appendChild(style);
  }

  connectedCallback() {
    if (!this.shadowRoot) return;
    this.shadowRoot.appendChild(this.container);

    this.container.appendChild(this.buttons);
    this.container.appendChild(this.contents);
    this.setupContainer();
    this.setupContents();
    this.setupButtons();
  }

  setupContainer() {
    this.container.id = "chatgpt-container";
    this.container.setAttribute("aria-label", "Chat widget");
  }

  setupButtons() {
    this.buttons.style.display = "flex";
    this.buttons.style.justifyContent = "flex-end";
    this.buttons.style.marginBottom = "10px";
    this.buttons.style.gap = "10px";

    const toggle = document.createElement("button");
    toggle.setAttribute("aria-label", "Toggle chat widget visibility");
    this.container.setAttribute("data-hidden", "true");
    toggle.textContent = "+";
    toggle.addEventListener("click", () => {
      const isHidden = this.container.getAttribute("data-hidden") === "true";
      toggle.textContent = !isHidden ? "+" : "-";
      this.container.setAttribute("data-hidden", isHidden ? "false" : "true");
    });

    // Add a clear button to clear the chat history.
    const clear = document.createElement("button");
    clear.setAttribute("aria-label", "Clear chat history");
    clear.id = "clear-button";
    clear.textContent = "Clear";
    clear.addEventListener("click", () => {
      const responses = this.container.querySelector(
        "chatgpt-response"
      ) as ChatGPTResponse;
      responses?.clear();
      clearHistory();
    });

    this.buttons.appendChild(clear);
    this.buttons.appendChild(toggle);
  }

  setupContents() {
    this.contents.id = "chatgpt-contents";
    this.contents.style.width = "300px";
    this.contents.style.transition = "transform 0.3s ease-in-out";
  }

  appendComponent(component: HTMLElement) {
    if (!this.shadowRoot) return;
    this.contents.appendChild(component);
  }
}

// Define the custom element
customElements.define("chatgpt-widget", ChatGPTWidget);
