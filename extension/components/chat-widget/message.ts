import { Role } from "utils/types";

export class ChatGPTMessage extends HTMLElement {
  readonly message: string;
  readonly type: Role;
  readonly container = document.createElement("div");

  constructor(message: string = "", type: Role = "user") {
    super();
    this.message = message;
    this.type = type;

    // Attach a shadow root to the custom element
    const shadow = this.attachShadow({ mode: "open" });

    // Create the message div
    const container = this.container;
    container.style.cssText = `
      padding: 5px 10px;
      margin: 0.5em 0;
      border-radius: 4px;
      background-color: ${type === "user" ? "#4285f4" : "#ccc"};
      color: ${type === "user" ? "#ffffff" : "#000000"};
      white-space: pre-wrap;
    `;
    container.setAttribute("aria-label", `Message from ${type}`);

    const style = document.createElement("style");
    style.textContent = `
      * {
        box-sizing: border-box;
      }
    `;

    // Inject the message div into the shadow root
    shadow.appendChild(container);
    shadow.appendChild(style);
  }

  connectedCallback() {
    this.container.textContent = this.message;
  }

  resetText(str: string = "") {
    this.container.textContent = str;
  }

  appendText(str: string) {
    this.container.textContent += str;
  }
}

// Define the custom message element
customElements.define("chatgpt-message", ChatGPTMessage);
