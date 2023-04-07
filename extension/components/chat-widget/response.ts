import { ChatGPTMessage } from "./message";

export class ChatGPTResponse extends HTMLElement {
  readonly container: HTMLDivElement = document.createElement("div");

  constructor() {
    super();

    // Attach a shadow root to the custom element
    const shadow = this.attachShadow({ mode: "open" });

    // Create the response div
    this.container.setAttribute("id", "chatgpt-response");
    this.container.style.cssText = `
      height: fit-content;
      overflow-y: auto;
      max-height: 50vh;
      margin-bottom: 1em;
      padding: 5px;
      /*border: 1px solid #ccc;*/
      scrollbar-width: thin;
      scrollbar-color: #888 #f1f1f1;
    `;

    const style = document.createElement("style");
    style.textContent = `
      * {
        box-sizing: border-box;
      }
      #chatgpt-response::-webkit-scrollbar {
        width: 8px;
      }

      #chatgpt-response::-webkit-scrollbar-track {
        background-color: var(--scrollbar-track-color, #f1f1f1);
        border-radius: 4px;
      }

      #chatgpt-response::-webkit-scrollbar-thumb {
        background-color: var(--scrollbar-thumb-color, #888);
        border-radius: 4px;
      }

      #chatgpt-response::-webkit-scrollbar-thumb:hover {
        background-color: var(--scrollbar-thumb-hover-color, #555);
      }
    `;

    // Inject the response div into the shadow root
    shadow.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: 1em;
        }
      </style>
    `;
    shadow.appendChild(style);
    shadow.appendChild(this.container);
  }

  appendMessage(message: ChatGPTMessage) {
    this.container.appendChild(message);
  }

  scrollToBottom() {
    this.container.scrollTop = this.container.scrollHeight;
  }

  clear() {
    this.container.innerHTML = "";
  }
}

// Define the custom response element
customElements.define("chatgpt-response", ChatGPTResponse);
