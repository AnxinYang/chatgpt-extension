import { Role, Message } from "utils/types";
import { WidgetEvent, WidgetEventType, widgetEvent } from "./utils";
import { generateMessage } from "history/message";

export interface IChatHistoryManager {
  addMessage(message: Message): Promise<void>;
  getMessages(): Message[];
  getTokenUsage(): number;
  getTokenUsageInPercentage(): string;
  deleteLastMessage(): void;
}

export interface ChatWidgetDeps {
  containerRender: () => HTMLElement;
  buttonsRender: (widget: ChatGPTWidget) => HTMLElement;
  conversationRender: () => HTMLElement;
  messageRender: (message: Message) => HTMLElement;
  inputRender: (widget: ChatGPTWidget) => HTMLElement;
  tokenUsageRender: (widget: ChatGPTWidget) => HTMLElement;
  donationInfoRender: (widget: ChatGPTWidget) => HTMLElement;
  toggleAnimater: (container: HTMLElement, innerContent: HTMLElement) => void;
  historyManager: IChatHistoryManager;
  systemMessages: Message[];
  pageContent: Message;
  tokenCounter: (str: string) => number;
  chatResponseStreamer: (
    messages: Message[],
    onMessage: (str: string) => void
  ) => Promise<Message>;
}

export class ChatGPTWidget extends HTMLElement {
  readonly containerRender: () => HTMLElement;
  readonly buttonsRender: (widget: ChatGPTWidget) => HTMLElement;
  readonly conversationRender: () => HTMLElement;
  readonly inputRender: (widget: ChatGPTWidget) => HTMLElement;
  readonly messageRender: (message: Message) => HTMLElement;
  readonly donationInfoRender: (widget: ChatGPTWidget) => HTMLElement;
  readonly tokenUsageRender: (widget: ChatGPTWidget) => HTMLElement;
  readonly toggleAnimater: (
    container: HTMLElement,
    innerContent: HTMLElement
  ) => void;
  readonly historyManager: IChatHistoryManager;
  readonly systemMessages: Message[];
  readonly pageContent: Message;

  readonly tokenCounter: (str: string) => number;
  readonly chatResponseStreamer: (
    messages: Message[],
    onMessage: (str: string) => void
  ) => Promise<Message>;

  readonly history: Message[] = [];
  readonly messageToElementMap = new Map<Message, HTMLElement>();

  container: HTMLElement | null = null;
  buttons: HTMLElement | null = null;
  conversation: HTMLElement | null = null;
  input: HTMLElement | null = null;
  tokenUsage: HTMLElement | null = null;
  donation: HTMLElement | null = null;

  constructor({
    containerRender,
    buttonsRender,
    conversationRender,
    inputRender,
    messageRender,
    tokenUsageRender,
    donationInfoRender,
    toggleAnimater,
    historyManager,
    systemMessages,
    pageContent,
    tokenCounter,
    chatResponseStreamer,
  }: ChatWidgetDeps) {
    super();
    this.containerRender = containerRender;
    this.buttonsRender = buttonsRender;
    this.conversationRender = conversationRender;
    this.inputRender = inputRender;
    this.messageRender = messageRender;
    this.tokenUsageRender = tokenUsageRender;
    this.donationInfoRender = donationInfoRender;

    this.toggleAnimater = toggleAnimater;
    this.historyManager = historyManager;
    this.systemMessages = systemMessages;
    this.pageContent = pageContent;
    this.tokenCounter = tokenCounter;
    this.chatResponseStreamer = chatResponseStreamer;
  }

  // Toggle the widget
  toggle() {
    const container = this.container;
    const innerContent = this.buttons;
    if (container && innerContent) {
      this.toggleAnimater(container, innerContent);
    }
  }

  // Handle user input
  async handleUserInput(input: string) {
    const userMessage = generateMessage(
      "user",
      input,
      this.tokenCounter(input)
    );

    // Render user message
    const userMessageElement = this.messageRender(userMessage);
    this.conversation?.appendChild(userMessageElement);
    this.conversation!.scrollTop = this.conversation!.scrollHeight;

    // Add user message to history
    await this.historyManager.addMessage(userMessage);

    // Get response from API
    const history = this.historyManager.getMessages();

    // Render a placeholder message
    const responseMessageElement = this.messageRender({
      role: "assistant",
      content: "...",
      tokenUsage: 0,
    });
    this.conversation?.appendChild(responseMessageElement);

    // Render response
    let isFirstStream = true;
    const response = await this.chatResponseStreamer(
      [...this.systemMessages, this.pageContent, ...history],
      (str) => {
        if (isFirstStream) {
          isFirstStream = false;
          responseMessageElement.textContent = "";
        }
        responseMessageElement.textContent += str;
        this.conversation!.scrollTop = this.conversation!.scrollHeight;
      }
    );

    // Add response to history
    await this.historyManager.addMessage(response);
    this.tokenUsage!.textContent = `Memory: ${this.historyManager.getTokenUsageInPercentage()}`;
  }

  render() {
    const shadow = this.attachShadow({ mode: "open" });
    this.container = this.containerRender();
    this.buttons = this.buttonsRender(this);
    this.conversation = this.conversationRender();
    this.input = this.inputRender(this);
    this.tokenUsage = this.tokenUsageRender(this);
    this.donation = this.donationInfoRender(this);
    const content = document.createElement("div");
    content.style.cssText = `
      padding: 10px;
      transform-origin: top right;
    `;

    shadow.appendChild(this.container);
    content.appendChild(this.buttons);
    content.appendChild(this.conversation);
    content.appendChild(this.input);
    content.appendChild(this.tokenUsage);
    content.appendChild(this.donation);
    this.container.appendChild(content);
  }

  setStyle() {
    const style = document.createElement("style");
    style.textContent = `
      * {
        box-sizing: border-box;
      }
      *::-webkit-scrollbar {
        width: 0px;
      }

      *::-webkit-scrollbar-track {
        background-color: var(--scrollbar-track-color, transparent);
        border-radius: 4px;
      }

      *::-webkit-scrollbar-thumb {
        background-color: var(--scrollbar-thumb-color, #888);
        border-radius: 4px;
      }

      *::-webkit-scrollbar-thumb:hover {
        background-color: var(--scrollbar-thumb-hover-color, #555);
      }
      `;
    this.shadowRoot?.appendChild(style);
  }
  connectedCallback() {
    this.render();
    this.setStyle();
  }
}

// Define the custom element
customElements.define("chatgpt-widget", ChatGPTWidget);
