import { WidgetEvent, WidgetEventType, widgetEvent } from "./utils";

export interface ChatWidgetDeps {
  containerRender: () => HTMLElement;
  buttonsRender: () => HTMLElement;
  conversationRender: () => HTMLElement;
  inputRender: () => HTMLElement;
}

export class ChatGPTWidget extends HTMLElement {
  readonly containerRender: () => HTMLElement;
  readonly buttonsRender: () => HTMLElement;
  readonly conversationRender: () => HTMLElement;
  readonly inputRender: () => HTMLElement;

  constructor({
    containerRender,
    buttonsRender,
    conversationRender,
    inputRender,
  }: ChatWidgetDeps) {
    super();
    this.containerRender = containerRender;
    this.buttonsRender = buttonsRender;
    this.conversationRender = conversationRender;
    this.inputRender = inputRender;
  }
  render() {
    const shadow = this.attachShadow({ mode: "open" });
    const container = this.containerRender();
    const buttons = this.buttonsRender();
    const conversation = this.conversationRender();
    const input = this.inputRender();

    shadow.appendChild(container);

    container.appendChild(buttons);
    container.appendChild(conversation);
    container.appendChild(input);

    container.addEventListener(
      WidgetEventType.REG_TOGGLE as any,
      (e: WidgetEvent) => {
        container.dispatchEvent(widgetEvent(WidgetEventType.TOGGLE));
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
  }
  connectedCallback() {
    this.render();
  }
}

// Define the custom element
customElements.define("chatgpt-widget", ChatGPTWidget);
