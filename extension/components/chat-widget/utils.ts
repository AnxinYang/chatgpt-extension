import { getChatCompletion } from "utils/api";
import { generateKeyframes } from "./styles";

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

export function toggleAnimater(
  container: HTMLElement,
  innerContent: HTMLElement
) {
  const isOpened = container.getAttribute("data-open") === "true";
  container.style.width = "72px";
  container.style.height = "48px";
  const containerCloseRect = container.getBoundingClientRect();
  const innerContentCloseRect = innerContent.getBoundingClientRect();
  container.style.width = "fit-content";
  container.style.height = "fit-content";
  const containerOpenRect = container.getBoundingClientRect();
  const innerContentOpenRect = innerContent.getBoundingClientRect();
  const animationOptions = {
    duration: 200,
    easing: "ease-in-out",
  };

  if (isOpened) {
    const [containerKeyframes, innerContentKeyframes] = generateKeyframes(
      containerOpenRect,
      containerCloseRect,
      innerContentOpenRect,
      innerContentCloseRect
    );
    container.style.width = "72px";
    container.style.height = "48px";
    container.animate(containerKeyframes, animationOptions);
    innerContent.animate(innerContentKeyframes, animationOptions);
  } else {
    const [containerKeyframes, innerContentKeyframes] = generateKeyframes(
      containerCloseRect,
      containerOpenRect,
      innerContentCloseRect,
      innerContentOpenRect
    );

    container.style.width = "fit-content";
    container.style.height = "fit-content";
    container.animate(containerKeyframes, animationOptions);
    innerContent.animate(innerContentKeyframes, animationOptions);
  }

  container.setAttribute("data-open", isOpened ? "false" : "true");
  console.log("toggleEventHandler");
}
