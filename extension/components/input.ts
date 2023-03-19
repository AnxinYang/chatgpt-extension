import { ChatGPTMessage } from "./message";
import { ChatGPTResponse } from "./response";

export class ChatGPTInput extends HTMLElement {
  outputTarget?: ChatGPTResponse;
  readonly inputElem = document.createElement("input");
  constructor() {
    super();

    // Attach a shadow root to the custom element
    this.attachShadow({ mode: "open" });

    const container = document.createElement("div");
    container.setAttribute("id", "chatgpt-input-container");
    container.style.width = "100%";
    container.style.height = "fit-content";
    container.style.margin = "1em auto";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.justifyContent = "space-between";
    container.style.alignItems = "center";

    // Create the input field
    const input = this.inputElem;
    input.setAttribute("id", "chatgpt-input");
    input.style.width = "100%";
    input.style.padding = "5px";
    input.style.marginBottom = "10px";
    input.placeholder = "Type your message here...";
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.sendInputToTarget();
      }
    });
    // Create the submit button
    const submitButton = document.createElement("button");
    submitButton.setAttribute("id", "chatgpt-submit");
    submitButton.textContent = "Send";
    submitButton.style.display = "block";
    submitButton.style.margin = "0 auto";
    submitButton.style.padding = "5px 10px";
    submitButton.style.backgroundColor = "#4285f4";
    submitButton.style.color = "#ffffff";
    submitButton.style.border = "none";
    submitButton.style.borderRadius = "4px";

    submitButton.addEventListener("click", () => {
      this.sendInputToTarget();
    });

    // Inject the input and submit button into the shadow root
    if (!this.shadowRoot) return;
    container.appendChild(input);
    container.appendChild(submitButton);
    this.shadowRoot.appendChild(container);
  }

  setOutputTarget(target: ChatGPTResponse) {
    this.outputTarget = target;
  }

  sendInputToTarget() {
    if (!this.outputTarget) return;
    const inputText = this.inputElem.value.trim();
    if (inputText.length === 0) return;
    this.inputElem.value = "";
    this.outputTarget.appendMessage(new ChatGPTMessage(inputText, "user"));

    // Here, you can also send the input to the ChatGPT API and display the response
    const responseMessage = new ChatGPTMessage(
      "The webcomponents-bundle.js contains all of the web components polyfills and is suitable for use on any supported browser. All of the polyfill code will be loaded but each polyfill will only be used based on feature detection. The bundle includes Custom Elements, Shady DOM/CSS and generic platform polyfills (such as ES6 Promise, Constructable events, etc.) (needed by Internet Explorer 11), and Template (needed by IE 11 and Edge).The webcomponents-bundle.js is very simple to use but it does load code that is not needed on most modern browsers, slowing page load. For best performance, use the webcomponents-loader.js.",
      "response"
    );
    this.outputTarget.appendMessage(responseMessage);
  }
}

// Define the custom input element
customElements.define("chatgpt-input", ChatGPTInput);
