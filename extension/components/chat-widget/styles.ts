export function applyCSStoElement(
  element: HTMLElement,
  css: Record<string, any>
) {
  Object.entries(css).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });
}

export function generateKeyframes(
  startRect: DOMRect,
  endRect: DOMRect,
  innerStartRect: DOMRect,
  innerEndRect: DOMRect
) {
  const steps = 24;
  const startScaleX = startRect.width / endRect.width;
  const endScaleX = 1;
  const startScaleY = startRect.height / endRect.height;
  const endScaleY = 1;
  const startX = startRect.left - endRect.left;
  const endX = 0;
  const startY = startRect.top - endRect.top;
  const endY = 0;

  const innerStartScaleX = innerStartRect.width / innerEndRect.width;
  const innerEndScaleX = 1;
  const innerStartScaleY = innerStartRect.height / innerEndRect.height;
  const innerEndScaleY = 1;
  const innerStartX = innerStartRect.left - innerEndRect.left;
  const innerEndX = 0;
  const innerStartY = innerStartRect.top - innerEndRect.top;
  const innerEndY = 0;

  const keyframes = [];

  const childElementKeyframes = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const scaleX = startScaleX + (endScaleX - startScaleX) * t;
    const scaleY = startScaleY + (endScaleY - startScaleY) * t;
    const x = startX + (endX - startX) * t;
    const y = startY + (endY - startY) * t;
    keyframes.push({
      transform: `translate(${startX}px, ${y}px) scale(${startScaleX}, ${scaleY})`,
    });

    const innerScaleX =
      innerStartScaleX + (innerEndScaleX - innerStartScaleX) * t;
    const innerScaleY =
      innerStartScaleY + (innerEndScaleY - innerStartScaleY) * t;
    const innerX = innerStartX + (innerEndX - innerStartX) * t;
    const innerY = innerStartY + (innerEndY - innerStartY) * t;

    childElementKeyframes.push({
      transform: `translate(${-startX}px, ${-y}px)  translate(${innerStartX}px, ${innerY}px) scale(${
        1 / startScaleX
      }, ${1 / scaleY})`,
    });
  }
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const scaleX = startScaleX + (endScaleX - startScaleX) * t;
    const scaleY = startScaleY + (endScaleY - startScaleY) * t;
    const x = startX + (endX - startX) * t;
    const y = startY + (endY - startY) * t;
    keyframes.push({
      transform: `translate(${x}px, ${0}px) scale(${scaleX}, ${1})`,
    });

    const innerScaleX =
      innerStartScaleX + (innerEndScaleX - innerStartScaleX) * t;
    const innerScaleY =
      innerStartScaleY + (innerEndScaleY - innerStartScaleY) * t;
    const innerX = innerStartX + (innerEndX - innerStartX) * t;
    const innerY = innerStartY + (innerEndY - innerStartY) * t;

    childElementKeyframes.push({
      transform: `translate(${-x}px, ${0}px)  translate(${innerX}px, ${0}px) scale(${
        1 / scaleX
      }, ${1 / 1})`,
    });
  }
  return [keyframes, childElementKeyframes] as const;
}
