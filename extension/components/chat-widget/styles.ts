export function applyCSStoElement(
  element: HTMLElement,
  css: Record<string, any>
) {
  Object.entries(css).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });
}
