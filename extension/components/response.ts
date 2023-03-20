import { ChatGPTMessage } from "./message";

export type sender = "user" | "response";

export class ChatGPTResponse extends HTMLElement {
  readonly container = document.createElement("div");
  constructor() {
    super();

    // Attach a shadow root to the custom element
    this.attachShadow({ mode: "open" });

    // Create the response div
    this.container.setAttribute("id", "chatgpt-response");
    this.container.style.height = "fit-content";
    this.container.style.overflowY = "auto";
    this.container.style.maxHeight = "50vh";
    this.container.style.marginBottom = "1em";
    this.container.style.padding = "5px";
    // this.container.style.border = "1px solid #ccc";

    const style = document.createElement("style");
    style.textContent = `
      * {
        box-sizing: border-box;
      }
      #chatgpt-response::-webkit-scrollbar {
        width: 8px;
      }

      #chatgpt-response::-webkit-scrollbar-track {
        background-color: #f1f1f1;
        border-radius: 4px;
      }

      #chatgpt-response::-webkit-scrollbar-thumb {
        background-color: #888;
        border-radius: 4px;
      }

      #chatgpt-response::-webkit-scrollbar-thumb:hover {
        background-color: #555;
      }
    `;

    // Inject the response div into the shadow root
    if (!this.shadowRoot) return;
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(this.container);
  }
  appendMessage(message: ChatGPTMessage) {
    if (!this.shadowRoot) return;
    this.container.appendChild(message);
  }
}

// Define the custom response element
customElements.define("chatgpt-response", ChatGPTResponse);
