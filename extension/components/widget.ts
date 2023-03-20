export class ChatGPTWidget extends HTMLElement {
  readonly container = document.createElement("div");
  readonly contents = document.createElement("div");
  readonly buttons = document.createElement("div");

  constructor() {
    super();

    // Attach a shadow root to the custom element
    this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
      * {
        box-sizing: border-box;
      }
      #chatgpt-contents[data-hidden="true"]{
        display: none;
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
    this.setupbuttons();
  }
  setupContainer() {
    this.container.style.position = "fixed";
    this.container.style.bottom = "20px";
    this.container.style.right = "20px";
    this.container.style.width = "fit-content";
    this.container.style.height = "fit-content";
    this.container.style.backgroundColor = "#353740";
    this.container.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    this.container.style.borderRadius = "4px";
    this.container.style.padding = "10px";
    this.container.style.zIndex = "9999";
  }

  setupbuttons() {
    this.buttons.style.display = "flex";
    this.buttons.style.justifyContent = "flex-end";
    this.buttons.style.marginBottom = "10px";

    const toggle = document.createElement("button");
    this.contents.setAttribute("data-hidden", "true");
    toggle.textContent = "+";
    toggle.addEventListener("click", () => {
      const isHidden = this.contents.getAttribute("data-hidden") === "true";
      toggle.textContent = !isHidden ? "+" : "-";
      this.contents.setAttribute("data-hidden", isHidden ? "false" : "true");
    });
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
