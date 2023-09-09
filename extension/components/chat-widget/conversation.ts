export interface ConversationRenderDeps {}

export function conversationRenderProvider({}: ConversationRenderDeps): () => HTMLElement {
  return () => {
    const container = document.createElement("div");

    container.style.cssText = `
        height: fit-content;
        overflow-y: auto;
        overflow-x: hidden;
        max-height: 50vh;
        min-width: 200px;
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
