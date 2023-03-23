import { getChatCompletion } from "utils/api";
import { addToHistory } from "utils/prompt";
import { ChatGPTMessage } from "./message";
import { ChatGPTResponse } from "./response";

export class ChatGPTInput extends HTMLElement {
  outputTarget?: ChatGPTResponse;
  readonly inputElem = document.createElement("input");
  readonly sendButton = document.createElement("button");
  processing = false;
  constructor() {
    super();

    // Attach a shadow root to the custom element
    this.attachShadow({ mode: "open" });

    const container = document.createElement("div");
    container.setAttribute("id", "chatgpt-input-container");
    container.style.width = "100%";
    container.style.height = "fit-content";
    container.style.margin = "auto";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.justifyContent = "space-between";
    container.style.alignItems = "center";

    // Create the input field
    const input = this.inputElem;
    input.setAttribute("id", "chatgpt-input");
    input.style.width = "100%";
    input.style.padding = "5px";
    input.style.marginBottom = "1em";
    input.style.borderRadius = "4px";
    input.style.color = "#ffffff";
    input.style.backgroundColor = "rgba(64,65,79,1)";
    input.style.border = "none";
    input.placeholder = "Type your message here...";
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.sendInputToTarget();
      }
    });
    // Create the submit button
    const submitButton = this.sendButton;
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

    const style = document.createElement("style");
    style.textContent = `
      * {
        box-sizing: border-box;
      }
    `;
    // Inject the input and submit button into the shadow root
    if (!this.shadowRoot) return;
    container.appendChild(input);
    container.appendChild(submitButton);
    this.shadowRoot.appendChild(container);
    this.shadowRoot.appendChild(style);
  }

  setOutputTarget(target: ChatGPTResponse) {
    this.outputTarget = target;
  }

  async sendInputToTarget() {
    if (!this.outputTarget) return;
    if (this.processing) return;

    const inputText = this.inputElem.value.trim();
    if (inputText.length === 0) return;
    this.inputElem.value = "";
    this.outputTarget.appendMessage(new ChatGPTMessage(inputText, "user"));

    this.setButtonToDisabled(true);

    const responseMessage = new ChatGPTMessage("...", "response");
    this.outputTarget.appendMessage(responseMessage);
    let newMessage = "";
    let isReset = false;

    await getChatCompletion(inputText, (message) => {
      if (!isReset) {
        responseMessage.resetText();
        isReset = true;
      }
      newMessage += message;
      responseMessage.appendText(message);
    });

    this.setButtonToDisabled(false);
    addToHistory(newMessage, "assistant");
  }

  setButtonToDisabled(disabled: boolean) {
    if (disabled) {
      // Disable the button and set the background to lightgrey.
      this.sendButton.setAttribute("disabled", "true");
      this.sendButton.style.backgroundColor = "lightgrey";
      this.sendButton.innerText = "Pending...";
    } else {
      this.sendButton.removeAttribute("disabled");
      this.sendButton.style.backgroundColor = "#4285f4";
      this.sendButton.innerText = "Send";
    }
  }
}

customElements.define("chatgpt-input", ChatGPTInput);
