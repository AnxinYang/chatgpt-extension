import { getChatCompletion } from "utils/api";
import { addToHistory } from "utils/prompt";
import { ChatGPTMessage } from "./message";
import { ChatGPTResponse } from "./response";

export class ChatGPTInput extends HTMLElement {
  outputTarget?: ChatGPTResponse;
  readonly inputElem: HTMLInputElement = document.createElement("input");
  readonly sendButton: HTMLButtonElement = document.createElement("button");
  processing = false;

  constructor() {
    super();

    // Attach a shadow root to the custom element
    const shadow = this.attachShadow({ mode: "open" });

    const container = document.createElement("div");
    container.setAttribute("id", "chatgpt-input-container");
    container.style.cssText = `
      width: 100%;
      height: fit-content;
      margin: auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    `;

    // Create the input field
    const input = this.inputElem;
    input.setAttribute("id", "chatgpt-input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Type your message here...");
    input.setAttribute("aria-label", "Type your message here");
    input.style.cssText = `
      width: 100%;
      padding: 5px;
      margin-bottom: 1em;
      border-radius: 4px;
      color: #ffffff;
      background-color: rgba(64,65,79,1);
      border: none;
    `;
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.sendInputToTarget();
      }
    });

    // Create the submit button
    const submitButton = this.sendButton;
    submitButton.setAttribute("id", "chatgpt-submit");
    submitButton.setAttribute("type", "button");
    submitButton.setAttribute("aria-label", "Send");
    submitButton.textContent = "Send";
    submitButton.style.cssText = `
      display: block;
      margin: 0 auto;
      padding: 5px 10px;
      background-color: #4285f4;
      color: #ffffff;
      border: none;
      border-radius: 4px;
    `;
    submitButton.addEventListener("click", () => {
      this.sendInputToTarget();
    });

    const style = document.createElement("style");
    style.textContent = `* { box-sizing: border-box; } `;

    container.appendChild(input);
    container.appendChild(submitButton);
    shadow.appendChild(container);
    shadow.appendChild(style);
  }

  setOutputTarget(target: ChatGPTResponse) {
    this.outputTarget = target;
  }

  async sendInputToTarget() {
    if (!this.outputTarget) return;
    if (this.processing) return;
    const inputText = this.inputElem.value.trim();
    if (inputText.length === 0) return;
    this.processing = true;
    this.inputElem.value = "";
    this.outputTarget.appendMessage(new ChatGPTMessage(inputText, "user"));

    this.setButtonToDisabled(true);

    const responseMessage = new ChatGPTMessage("...", "response");
    this.outputTarget.appendMessage(responseMessage);
    let newMessage = "";
    let isReset = false;

    try {
      await getChatCompletion(inputText, (message) => {
        if (!isReset) {
          responseMessage.resetText();
          isReset = true;
        }
        newMessage += message;
        responseMessage.appendText(message);
      });
      addToHistory(newMessage, "assistant");
    } catch (error) {
      console.error(error);
      responseMessage.resetText();
      responseMessage.appendText("Sorry, something went wrong.");
    }
    this.processing = false;
    this.setButtonToDisabled(false);
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
