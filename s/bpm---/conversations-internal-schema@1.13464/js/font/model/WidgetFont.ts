import { DEFAULT_FONT_FAMILY, SYSTEM_FONTS } from '../constants/constants';
const defaultWidgetFont = {
  fontFamily: DEFAULT_FONT_FAMILY,
  fallbacks: [],
  variants: [],
  fontGroup: SYSTEM_FONTS
};
const WidgetFont = widgetFontOptions => Object.assign({}, defaultWidgetFont, widgetFontOptions);
export default WidgetFont;