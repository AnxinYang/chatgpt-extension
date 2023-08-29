import { getChatCompletion } from "utils/api";

export interface WidgetEvent<BodyT = undefined> extends CustomEvent {
  detail: BodyT;
}

export enum WidgetEventType {
  REG_TOGGLE = "chat-widget-0",
  TOGGLE = "chat-widget-1",
  REG_SUBMIT = "chat-widget-2",
  SUBMIT = "chat-widget-3",
  REG_ADD_CONVERSATION = "chat-widget-4",
  ADD_CONVERSATION = "chat-widget-5",
}

export function widgetEvent<BodyT>(
  eventName: string,
  detail?: BodyT
): WidgetEvent<BodyT> {
  return new CustomEvent(eventName, { detail, bubbles: true });
}

export function toggleButtonHandler(e: MouseEvent) {
  const event = widgetEvent(WidgetEventType.REG_TOGGLE);
  console.log("toggleButtonHandler", event);
  e.target?.dispatchEvent(event);
}

export function toggleEventHandler(
  this: HTMLElement,
  e: WidgetEvent<undefined>
) {
  const container = this as HTMLElement;
  const hidden = container.getAttribute("data-hidden") === "true";
  container.setAttribute("data-hidden", String(!hidden));
  console.log("toggleEventHandler", e);
}

export function submitHandler(this: HTMLElement, str: string) {
  const event = widgetEvent.call(this, WidgetEventType.REG_SUBMIT, str);
  this.dispatchEvent(event);
}

export function submitEventHandlerProvider({
  messageRender,
}: {
  messageRender: (content: string, isUser: boolean) => HTMLElement;
}) {
  return async (e: WidgetEvent<string>, appendMessageTo: HTMLElement) => {
    console.log("submitEventHandler", e);
    const message = e.detail;
    const messageElement = messageRender("...", false);
    appendMessageTo.appendChild(messageElement);
    let isFristString = true;
    await getChatCompletion(message, (str) => {
      if (isFristString) {
        messageElement.textContent = "";
        isFristString = false;
      }
      messageElement.textContent += str;
      const messageContainer = messageElement.parentElement as HTMLElement;
      messageContainer.scrollTop = messageContainer.scrollHeight;
    });
  };
}

export function addConversationHandler(
  this: HTMLElement,
  str: string,
  isUser: boolean = true
) {
  const event = widgetEvent.call(this, WidgetEventType.REG_ADD_CONVERSATION, {
    content: str,
    isUser,
  });
  this.dispatchEvent(event);
  console.log("addConversationHandler", event);
}

export function addConversationEventHandlerProvider({
  messageRender,
}: {
  messageRender: (content: string, isUser: boolean) => HTMLElement;
}) {
  return function (
    e: WidgetEvent<{ content: string; isUser: boolean }>,
    container: HTMLElement
  ) {
    const message = messageRender(e.detail.content, e.detail.isUser);
    container.appendChild(message);

    container.scrollTop = container.scrollHeight;
    console.log("addConversationEventHandler", e);
  };
}
