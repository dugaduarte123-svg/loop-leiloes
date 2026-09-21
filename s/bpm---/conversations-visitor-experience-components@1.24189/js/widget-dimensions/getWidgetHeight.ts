import { calculateChatWidgetHeight } from './calculateChatWidgetHeight';
import { SPACING_ABOVE_WIDGET } from './constants/dimensions';
const WIDGET_WRAPPER_PADDING = 32;
const IFRAME_BOTTOM_OFFSET = 32;
export const SPOTLIGHT_OVERHEAD = WIDGET_WRAPPER_PADDING + SPACING_ABOVE_WIDGET + IFRAME_BOTTOM_OFFSET;
export const SPOTLIGHT_MIN_PANEL_HEIGHT = 58;
export function getWidgetHeight({
  isDetached,
  mobile,
  browserWindowHeight,
  widgetSize,
  showCloseButton,
  spotlightLauncherHeight
}) {
  if (isDetached) return '100vh';
  if (mobile) return '100%';
  const desiredHeight = calculateChatWidgetHeight(browserWindowHeight, widgetSize.height, {
    showCloseButton
  });
  const base = `var(--widget-height, ${desiredHeight}px)`;
  if (spotlightLauncherHeight) {
    const availableHeight = Math.max(browserWindowHeight - spotlightLauncherHeight - SPOTLIGHT_OVERHEAD, SPOTLIGHT_MIN_PANEL_HEIGHT);
    return `min(${base}, ${availableHeight}px)`;
  }
  return base;
}