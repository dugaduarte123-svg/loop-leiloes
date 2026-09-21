import { hexToRgba } from 'visitor-ui-component-library/utils/hexToRgba';
export const getAskBarBorderColor = ({
  showValidationMessage,
  glowColor,
  isFocused,
  theme
}) => {
  if (showValidationMessage) return theme.spotlight.color.error;
  if (!glowColor) return theme.spotlight.color.border;
  return isFocused ? glowColor : hexToRgba(glowColor, 0.35);
};