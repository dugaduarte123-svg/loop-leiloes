const HORIZONTAL_SPACING = 32;
export function calculateChatWidgetWidth(windowWidth, desiredWidgetWidth) {
  if (desiredWidgetWidth + HORIZONTAL_SPACING < windowWidth) {
    return desiredWidgetWidth;
  } else {
    return windowWidth - HORIZONTAL_SPACING;
  }
}