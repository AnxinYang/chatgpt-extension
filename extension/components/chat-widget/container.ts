import { WidgetEvent, WidgetEventType } from "./utils";

export interface ContainerRenderDeps {
  toggleEventHandler: (this: HTMLElement, e: WidgetEvent<undefined>) => void;
}

export function containerRenderProvider({
  toggleEventHandler,
}: ContainerRenderDeps): () => HTMLElement {
  return () => {
    const container = document.createElement("div");
    container.setAttribute("id", "chatgpt-container");
    container.setAttribute("data-hidden", "true");
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: fit-content;
      height: fit-content;
      background-color: rgb(53 55 64 / 70%);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px); /* For Safari */
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      padding: 10px;
      z-index: 99999;
    `;

    container.addEventListener(
      WidgetEventType.TOGGLE as any,
      toggleEventHandler
    );

    return container;
  };
}
