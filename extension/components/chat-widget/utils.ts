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

export function toggleButtonHandler(this: HTMLElement, e: MouseEvent) {
  const event = widgetEvent.call(this, WidgetEventType.REG_TOGGLE);
  console.log("toggleButtonHandler", event);
  this.dispatchEvent(event);
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

export function submitEventHandler(this: HTMLElement, e: WidgetEvent<string>) {
  console.log("submitEventHandler", e);
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
    this: HTMLElement,
    e: WidgetEvent<{ content: string; isUser: boolean }>
  ) {
    const container = this as HTMLElement;
    const message = messageRender(e.detail.content, e.detail.isUser);
    container.appendChild(message);

    console.log("addConversationEventHandler", e);
  };
}
