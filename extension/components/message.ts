export class ChatGPTMessage extends HTMLElement {
  message: string;
  container = document.createElement("div");
  readonly type;
  constructor(message: string = "", type = "user") {
    super();
    this.message = message;
    this.type = type;
    // Attach a shadow root to the custom element
    this.attachShadow({ mode: "open" });

    // Create the message div
    this.container.style.padding = "5px 10px";
    this.container.style.marginTop = "1.25em";
    this.container.style.borderRadius = "4px";
    this.container.style.backgroundColor = type === "user" ? "#4285f4" : "#ccc";
    this.container.style.color = type === "user" ? "#ffffff" : "#000000";
    this.container.style.whiteSpace = "pre-wrap";
    const style = document.createElement("style");
    style.textContent = `
      * {
        box-sizing: border-box;
      }
    `;

    // Inject the message div into the shadow root
    if (!this.shadowRoot) return;
    this.shadowRoot.appendChild(this.container);
    this.shadowRoot.appendChild(style);
  }
  connectedCallback() {
    this.container.scrollIntoView(false);
    this.container.textContent = this.message;
  }
  resetText = (str: string = "") => {
    this.container.textContent = str;
  };

  appendText = (str: string) => {
    this.container.textContent += str;
  };
}

// Define the custom message element
customElements.define("chatgpt-message", ChatGPTMessage);
