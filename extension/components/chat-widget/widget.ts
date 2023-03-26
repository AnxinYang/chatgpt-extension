import { clearHistory } from "utils/prompt";
import { ChatGPTResponse } from "./response";

export class ChatGPTWidget extends HTMLElement {
  readonly container = document.createElement("div");
  readonly contents = document.createElement("div");
  readonly buttons = document.createElement("div");
  readonly ads = document.createElement("div");

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
      * button {
        cursor: pointer;
        border: none;
        color: white;
        background: #6e6e80;
        border-radius: 4px;
      }
      #chatgpt-container[data-hidden="true"] #my-ads{
        display: none;
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
        background-color: ${options.color ?? "rgb(53 55 64 / 50%)"};
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px); /* For Safari */
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
    this.container.appendChild(this.ads);
    this.setupContainer();
    this.setupContents();
    this.setupButtons();
    this.setupAds();
  }

  setupContainer() {
    this.container.id = "chatgpt-container";
    this.container.setAttribute("aria-label", "Chat widget");
  }

  setupAds() {
    this.ads.id = "my-ads";
    this.ads.style.width = "100%";
    this.ads.style.fontSize = "0.75em";
    this.ads.style.marginTop = "10px";
    const buyMeACoffee = document.createElement("a");
    buyMeACoffee.setAttribute(
      "href",
      "https://www.buymeacoffee.com/anxinyang1E"
    );
    buyMeACoffee.setAttribute("target", "_blank");

    buyMeACoffee.style.color = "#eee";
    buyMeACoffee.innerText = "Buy me a coffee, if you like this project.";

    this.ads.appendChild(buyMeACoffee);
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

    // Add a button to remove the chat widget.
    const remove = document.createElement("button");
    remove.setAttribute("aria-label", "Remove chat widget");
    remove.textContent = "X";
    remove.style.background = "#8d2c2c";
    remove.addEventListener("click", () => {
      this.container.remove();
    });

    this.buttons.appendChild(clear);
    this.buttons.appendChild(toggle);
    this.buttons.appendChild(remove);
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
