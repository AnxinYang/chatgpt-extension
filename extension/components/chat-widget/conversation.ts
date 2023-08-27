import { WidgetEvent, WidgetEventType } from "./utils";

export interface ConversationRenderDeps {
  addConversationEventHandler: (
    this: HTMLElement,
    e: WidgetEvent<{ content: string; isUser: boolean }>
  ) => void;
}

export function conversationRenderProvider({
  addConversationEventHandler,
}: ConversationRenderDeps): () => HTMLElement {
  return () => {
    const container = document.createElement("div");
    container.addEventListener(WidgetEventType.ADD_CONVERSATION as any, (e) => {
      addConversationEventHandler.call(container, e);
    });
    container.style.cssText = `
        height: fit-content;
        overflow-y: auto;
        overflow-x: hidden;
        max-height: 50vh;
        width: 600px;
        max-width: 30vw;
    `;
    return container;
  };
}
