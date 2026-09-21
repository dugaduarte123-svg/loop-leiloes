const TEXTAREA_LINE_HEIGHT = 24;
const TEXTAREA_VERTICAL_PADDING = 2 * 2;
const SINGLE_LINE_HEIGHT = TEXTAREA_LINE_HEIGHT + TEXTAREA_VERTICAL_PADDING;
export function getNextMultiLineState(isCurrentlyMultiLine, scrollHeight, textValue) {
  if (textValue.length === 0) return false;
  if (textValue.includes('\n') || scrollHeight > SINGLE_LINE_HEIGHT) return true;
  return isCurrentlyMultiLine;
}