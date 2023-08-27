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
    container.addEventListener(
      WidgetEventType.ADD_CONVERSATION as any,
      addConversationEventHandler
    );
    return container;
  };
}
