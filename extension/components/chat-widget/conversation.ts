import { WidgetEvent, WidgetEventType } from "./utils";

export interface ConversationRenderDeps {
  addConversationEventHandler: (
    e: WidgetEvent<{ content: string; isUser: boolean }>,
    container: HTMLElement
  ) => void;
}

export function conversationRenderProvider({
  addConversationEventHandler,
}: ConversationRenderDeps): () => HTMLElement {
  return () => {
    const container = document.createElement("div");
    container.addEventListener(WidgetEventType.ADD_CONVERSATION as any, (e) => {
      addConversationEventHandler(e, container);
    });
    container.style.cssText = `
        height: fit-content;
        overflow-y: auto;
        overflow-x: hidden;
        max-height: 50vh;
        width: 600px;
        max-width: 30vw;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        margin: 12px 0;
    `;
    return container;
  };
}
