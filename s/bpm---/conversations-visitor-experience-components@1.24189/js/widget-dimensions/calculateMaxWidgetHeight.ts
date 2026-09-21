import { SPACING_ABOVE_WIDGET, CLOSE_BUTTON_AND_SPACING } from './constants/dimensions';
export function calculateMaxWidgetHeight(desiredWidgetHeight, {
  showCloseButton
}) {
  let maxHeight = desiredWidgetHeight + SPACING_ABOVE_WIDGET;
  if (showCloseButton) {
    maxHeight += CLOSE_BUTTON_AND_SPACING;
  }
  return maxHeight;
}