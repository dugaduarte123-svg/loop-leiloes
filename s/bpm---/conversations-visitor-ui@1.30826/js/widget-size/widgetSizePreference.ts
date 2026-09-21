export const WIDGET_MIN_WIDTH = 300;
export const WIDGET_MIN_HEIGHT = 400;
export const DOCKED_WIDGET_WIDTH = 500;
const VIEWPORT_EDGE_GUTTER_PX = 32;
const VIEWPORT_TOP_GUTTER_PX = 100;
const PILL_VIEWPORT_TOP_GUTTER_PX = 25;
export const clampWidgetSize = ({
  width,
  height,
  browserWindowWidth,
  browserWindowHeight,
  usePillLauncher,
  minWidth = WIDGET_MIN_WIDTH,
  minHeight = WIDGET_MIN_HEIGHT
}) => {
  const topGutter = usePillLauncher ? PILL_VIEWPORT_TOP_GUTTER_PX : VIEWPORT_TOP_GUTTER_PX;
  const maxWidth = Math.max(0, browserWindowWidth - VIEWPORT_EDGE_GUTTER_PX);
  const maxHeight = Math.max(0, browserWindowHeight - topGutter);
  return {
    width: Math.min(maxWidth, Math.max(minWidth, Math.min(width, maxWidth))),
    height: Math.min(maxHeight, Math.max(minHeight, Math.min(height, maxHeight)))
  };
};