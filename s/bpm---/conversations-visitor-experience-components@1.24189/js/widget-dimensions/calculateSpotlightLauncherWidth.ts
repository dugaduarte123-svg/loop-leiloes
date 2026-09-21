import { calculateChatWidgetWidth } from './calculateChatWidgetWidth';
const SPOTLIGHT_WIDTH = 360;
const SPOTLIGHT_EXPANDED_WIDTH = 700;
export function calculateSpotlightLauncherWidth(browserWindowWidth, isExpanded) {
  const desiredWidth = isExpanded ? SPOTLIGHT_EXPANDED_WIDTH : SPOTLIGHT_WIDTH;
  return calculateChatWidgetWidth(browserWindowWidth, desiredWidth);
}