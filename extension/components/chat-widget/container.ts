import { WidgetEvent, WidgetEventType } from "./utils";

export interface ContainerRenderDeps {}

export function containerRenderProvider({}: ContainerRenderDeps): () => HTMLElement {
  return () => {
    const container = document.createElement("div");
    container.setAttribute("id", "chatgpt-container");
    container.setAttribute("data-hidden", "true");
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: rgb(53 55 64 / 50%);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px); /* For Safari */
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      z-index: 99999;
      overflow: hidden;
      transform-origin: top left;
    `;

    container.style.width = "72px";
    container.style.height = "48px";

    return container;
  };
}
