import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { WEB_FONTS } from 'conversations-internal-schema/font/constants/constants';
import { setTransparentOnBackgroundIconButton } from 'visitor-ui-component-library/button/theme/iconButtonThemeOperators';
import { DEFAULT_HELP_TEXT_COLOR } from 'visitor-ui-component-library/theme/ColorConstants';
import { createTheme } from 'visitor-ui-component-library/theme/createTheme';
import { setFontFamily, setPrimaryColor } from 'visitor-ui-component-library/theme/defaultThemeOperators';
import { DEFAULT_FONT_FAMILY } from 'visitor-ui-component-library/theme/fontConstants';
import VizExThemeProvider from 'visitor-ui-component-library/theme/VizExThemeProvider';
import { getFontWithFallback } from 'visitor-ui-component-library/utils/getFontWithFallback';
import { getColoring } from '../selectors/widgetDataSelectors/getColoring';
import { generateFontStylesheet } from '../utils/fonts';
import { getWidgetFont } from '../widget-data/selectors/getWidgetFont';
import { jsx as _jsx } from "react/jsx-runtime";
const ThemeProvider = ({
  children
}) => {
  const coloring = useSelector(getColoring);
  const {
    accentColor,
    useDefaultColor
  } = coloring;
  const widgetFont = useSelector(getWidgetFont);
  const {
    fontFamily,
    fallbacks,
    variants,
    fontGroup
  } = widgetFont;
  const operators = [setFontFamily(DEFAULT_FONT_FAMILY)];
  const fontWithFallback = getFontWithFallback(fontFamily, fallbacks);
  operators.push(setFontFamily(fontWithFallback));
  if (useDefaultColor) {
    operators.push(setPrimaryColor(DEFAULT_HELP_TEXT_COLOR));
    operators.push(setTransparentOnBackgroundIconButton(DEFAULT_HELP_TEXT_COLOR));
  } else if (accentColor) {
    operators.push(setPrimaryColor(accentColor));
  }
  useEffect(() => {
    let fontStyleEl = null;
    if (fontFamily && fontGroup === WEB_FONTS) {
      fontStyleEl = generateFontStylesheet(fontFamily, variants);
      document.head.appendChild(fontStyleEl);
    }
    return () => {
      if (fontStyleEl instanceof HTMLElement) {
        var _document$head;
        (_document$head = document.head) === null || _document$head === void 0 || _document$head.removeChild(fontStyleEl);
      }
    };
  }, [fontFamily, variants, fontGroup]);
  return /*#__PURE__*/_jsx(VizExThemeProvider, {
    theme: createTheme(...operators),
    children: children
  });
};
ThemeProvider.displayName = 'ThemeProvider';
export default ThemeProvider;