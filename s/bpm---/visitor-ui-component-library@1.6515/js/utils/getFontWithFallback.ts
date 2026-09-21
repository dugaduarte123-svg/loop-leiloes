import { DEFAULT_FONT_FAMILY } from '../theme/fontConstants';
const HELVETICA = 'helvetica';
const hasSpacesWithoutQuotes = fontFamily => {
  return fontFamily.includes(' ') && !fontFamily.includes('"') && !fontFamily.includes("'");
};
const formattedFontForCss = fontFamily => {
  if (hasSpacesWithoutQuotes(fontFamily)) {
    return `"${fontFamily}"`;
  }
  return fontFamily;
};
export function getFontWithFallback(fontFamily, fallback) {
  if (!fontFamily || fontFamily === `${DEFAULT_FONT_FAMILY}` || (fontFamily === null || fontFamily === void 0 ? void 0 : fontFamily.toLowerCase()) === HELVETICA) {
    return DEFAULT_FONT_FAMILY;
  } else if (Array.isArray(fallback)) {
    const formattedFont = formattedFontForCss(fontFamily);
    return fallback.length ? [formattedFont, ...fallback].join(', ') : `${formattedFont}, ${DEFAULT_FONT_FAMILY}`;
  } else {
    const formattedFont = formattedFontForCss(fontFamily);
    return `${formattedFont}, ${fallback || DEFAULT_FONT_FAMILY}`;
  }
}