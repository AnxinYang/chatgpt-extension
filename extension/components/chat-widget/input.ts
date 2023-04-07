import { getChatCompletion } from "utils/api";
import { addToHistory, getCurrentTokenUsage } from "utils/prompt";
import { ChatGPTMessage } from "./message";
import { ChatGPTResponse } from "./response";
import { MAX_INPUT_TOKENS, MAX_MEMORY_TOKENS } from "utils/constants";
import { getTokenizedString } from "utils/system/get-tokenized-string";

export class ChatGPTInput extends HTMLElement {
  outputTarget?: ChatGPTResponse;
  readonly inputElem: HTMLInputElement = document.createElement("input");
  readonly sendButton: HTMLButtonElement = document.createElement("button");
  readonly inputElementsContainer: HTMLDivElement =
    document.createElement("div");
  readonly memoryUsageElem: HTMLSpanElement = document.createElement("span");
  readonly tokenUsageElem: HTMLSpanElement = document.createElement("span");
  readonly statusContainer: HTMLDivElement = document.createElement("div");
  processing = false;
  calculationTimer?: number;

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

    this.setupInputElements();
    this.setupStatusElements();
    container.appendChild(this.inputElementsContainer);
    container.appendChild(this.statusContainer);
    shadow.appendChild(container);
  }

  setupStatusElements() {
    const container = this.statusContainer;
    container.style.cssText = `
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
  `;

    // Create memory usage indicator
    const memoryUsage = this.memoryUsageElem;
    memoryUsage.setAttribute("id", "chatgpt-memory-usage");
    memoryUsage.style.cssText = `
      height: fit-content;
      font-size: 0.8em;
      color: #eee;
      text-align: left;
      margin-bottom: 0.25em;
      white-space: nowrap;
    `;

    // Create token usage indicator
    const tokenUsage = this.tokenUsageElem;
    tokenUsage.setAttribute("id", "chatgpt-token-usage");
    tokenUsage.style.cssText = `
      height: fit-content;
      font-size: 0.8em;
      color: #eee;
      text-align: left;
      margin-bottom: 0.25em;
      white-space: nowrap;
  `;

    container.appendChild(memoryUsage);
    container.appendChild(tokenUsage);
  }

  setupInputElements() {
    const container = this.inputElementsContainer;
    container.style.cssText = `
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      background-color: rgba(64,65,79,1);
      border-radius: 4px;
      margin-bottom: 0.25em;
    `;

    // Create the input field
    const input = this.inputElem;
    input.setAttribute("id", "chatgpt-input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Type your message here...");
    input.setAttribute("aria-label", "Type your message here");
    input.setAttribute("autocomplete", "off");

    input.style.cssText = `
      width: 100%;
      padding: 5px;
      border-radius: 4px;
      color: #ffffff;
      background-color: transparent;
      border: none;
      outline:none;
    `;
    input.addEventListener("keydown", (event) => {
      event.stopPropagation();
      if (event.key === "Enter") {
        event.preventDefault();
        this.handleInput();
      }
      this.updataTokenUsage();
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
      this.handleInput();
    });

    container.appendChild(input);
    container.appendChild(submitButton);
  }

  setOutputTarget(target: ChatGPTResponse) {
    this.outputTarget = target;
  }

  appendUserInputToTarget(inputText: string) {
    if (!this.outputTarget) throw new Error("Output target not set");
    const tokenizedString = getTokenizedString(inputText);
    if (tokenizedString.encode.bpe.length > MAX_INPUT_TOKENS) {
      throw new Error("Your input is too long. Please shorten it.");
    }
    this.outputTarget.appendMessage(new ChatGPTMessage(inputText, "user"));
    addToHistory(inputText, "user");
    this.inputElem.value = "";
  }

  async appendChatCompletionToTarget(inputText: string) {
    const responseMessage = new ChatGPTMessage("...", "assistant");
    this.outputTarget?.appendMessage(responseMessage);
    let isReset = false;

    const newMessage = await getChatCompletion(inputText, (message) => {
      if (!isReset) {
        responseMessage.resetText();
        isReset = true;
      }
      responseMessage.appendText(message);
      this.outputTarget?.scrollToBottom();
    });
    addToHistory(newMessage, "assistant");
  }

  updataTokenUsage() {
    if (this.calculationTimer) clearTimeout(this.calculationTimer);
    this.calculationTimer = setTimeout(() => {
      const tokenizedString = getTokenizedString(this.inputElem.value);
      this.tokenUsageElem.innerText = `Token: ${tokenizedString.encode.bpe.length}/${MAX_INPUT_TOKENS}`;
    }, 500);
  }

  updateMemoryUsage() {
    this.memoryUsageElem.innerText = `Memorized tokens: ${getCurrentTokenUsage()}/ ${MAX_MEMORY_TOKENS}`;
  }

  async handleInput() {
    if (this.processing) return;
    const inputText = this.inputElem.value.trim();
    if (inputText.length === 0) return;
    try {
      this.setInputToDisabled(true);
      this.appendUserInputToTarget(inputText);
      await this.appendChatCompletionToTarget(inputText);
    } catch (error) {
      this.outputTarget?.appendMessage(
        new ChatGPTMessage((error as Error).message, "assistant")
      );
    }
    this.outputTarget?.scrollToBottom();
    this.updataTokenUsage();
    this.updateMemoryUsage();
    this.setInputToDisabled(false);
  }

  setInputToDisabled(disabled: boolean) {
    if (disabled) {
      this.processing = true;
      // Disable the button and set the background to lightgrey.
      this.sendButton.setAttribute("disabled", "true");
      this.sendButton.style.backgroundColor = "lightgrey";
      this.sendButton.innerText = "Pending...";
    } else {
      this.processing = false;
      this.sendButton.removeAttribute("disabled");
      this.sendButton.style.backgroundColor = "#4285f4";
      this.sendButton.innerText = "Send";
    }
  }
}

customElements.define("chatgpt-input", ChatGPTInput);
