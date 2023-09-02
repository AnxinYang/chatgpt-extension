import { Message } from "utils/types";
import { WidgetEvent, WidgetEventType, widgetEvent } from "./utils";

export interface ChatWidgetDeps {
  containerRender: () => HTMLElement;
  buttonsRender: () => HTMLElement;
  conversationRender: () => HTMLElement;
  inputRender: () => HTMLElement;
  submitEventHandler: (
    e: WidgetEvent<string>,
    appendMessageTo: HTMLElement
  ) => Promise<HTMLElement>;
  toggleEventHandler: (
    container: HTMLElement,
    innerContent: HTMLElement
  ) => void;
}

export class ChatGPTWidget extends HTMLElement {
  readonly containerRender: () => HTMLElement;
  readonly buttonsRender: () => HTMLElement;
  readonly conversationRender: () => HTMLElement;
  readonly inputRender: () => HTMLElement;
  readonly submitEventHandler: (
    this: HTMLElement,
    e: WidgetEvent<string>,
    appendMessageTo: HTMLElement
  ) => Promise<HTMLElement>;
  readonly toggleEventHandler: (
    container: HTMLElement,
    innerContent: HTMLElement
  ) => void;

  readonly history: Message[] = [];

  constructor({
    containerRender,
    buttonsRender,
    conversationRender,
    inputRender,
    submitEventHandler,
    toggleEventHandler,
  }: ChatWidgetDeps) {
    super();
    this.containerRender = containerRender;
    this.buttonsRender = buttonsRender;
    this.conversationRender = conversationRender;
    this.inputRender = inputRender;
    this.submitEventHandler = submitEventHandler;
    this.toggleEventHandler = toggleEventHandler;
  }
  render() {
    const shadow = this.attachShadow({ mode: "open" });
    const container = this.containerRender();
    const buttons = this.buttonsRender();
    const conversation = this.conversationRender();
    const input = this.inputRender();
    const content = document.createElement("div");
    content.style.cssText = `
      padding: 10px;
      transform-origin: top right;
    `;

    shadow.appendChild(container);

    content.appendChild(buttons);
    content.appendChild(conversation);
    content.appendChild(input);

    container.appendChild(content);

    container.addEventListener(
      WidgetEventType.REG_TOGGLE as any,
      (e: WidgetEvent) => {
        this.toggleEventHandler(container, content);
      }
    );

    container.addEventListener(
      WidgetEventType.REG_ADD_CONVERSATION as any,
      (e: WidgetEvent) => {
        conversation.dispatchEvent(
          widgetEvent(WidgetEventType.ADD_CONVERSATION, e.detail)
        );
      }
    );

    container.addEventListener(WidgetEventType.REG_SUBMIT as any, (e) => {
      this.submitEventHandler(e, conversation);
    });
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
