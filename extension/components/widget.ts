import { ChatGPTResponse } from "./response";

export class ChatGPTWidget extends HTMLElement {
  readonly container = document.createElement("div");
  constructor() {
    super();

    // Attach a shadow root to the custom element
    this.attachShadow({ mode: "open" });

    // Create the container
  }
  connectedCallback() {
    if (!this.shadowRoot) return;
    this.shadowRoot.appendChild(this.container);
    this.setupContainer();
  }

  setupContainer() {
    this.container.setAttribute("id", "chatgpt-container");
    this.container.style.position = "fixed";
    this.container.style.bottom = "20px";
    this.container.style.right = "20px";
    this.container.style.width = "300px";
    this.container.style.height = "fit-content";
    this.container.style.backgroundColor = "#ffffff";
    this.container.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    this.container.style.borderRadius = "4px";
    this.container.style.padding = "10px";
    this.container.style.zIndex = "9999";
  }

  appendComponent(component: HTMLElement) {
    if (!this.shadowRoot) return;
    this.container.appendChild(component);
  }
}

// Define the custom element
customElements.define("chatgpt-widget", ChatGPTWidget);
