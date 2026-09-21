import { calculatePixelsToShrinkBy } from './calculatePixelsToShrinkBy';
export function calculateChatWidgetHeight(windowHeight, desiredWidgetHeight, {
  showCloseButton
}) {
  return desiredWidgetHeight - calculatePixelsToShrinkBy(windowHeight, desiredWidgetHeight, {
    showCloseButton
  });
}