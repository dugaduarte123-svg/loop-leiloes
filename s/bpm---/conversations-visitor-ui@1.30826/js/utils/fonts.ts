const getFontUrl = (family, variant) => `https://cdn1.hubspot.net/googlefonts/fonts/${family}/${variant}`;
const VARIANT_PATTERN = /(bold|b|[0-9]{3})?(italic|i)?/;

/**
 *
 * @param {string} weight ex. 400, 700, bold, b
 * @returns {string} Parsed weight
 */
const parseWeight = weight => {
  if (!weight) {
    return '400';
  }
  if (weight === 'bold' || weight === 'b') {
    return '700';
  }
  return weight;
};

/**
 *
 * @param variant ex. 400, 700, bold, b, i, italic, regular, bi, 400italic
 * @returns {Object} Parsed variant
 */
export const parseVariant = variant => {
  if (variant === 'regular') {
    return {
      weight: '400',
      style: 'normal'
    };
  }
  const match = variant.match(VARIANT_PATTERN);
  if (!match) {
    return {
      weight: '400',
      style: 'normal'
    };
  }
  const [__, weight, style] = match;
  return {
    style: style ? 'italic' : 'normal',
    weight: parseWeight(weight)
  };
};
export function generateFontStylesheet(fontFamily, variants) {
  const fontStylesheet = document.createElement('style');
  fontStylesheet.setAttribute('id', `live-chat-font-style-${fontFamily.toLocaleLowerCase().replace(/ +/g, '-')}`);
  fontStylesheet.textContent = variants.reduce((acc, variant) => {
    const {
      weight,
      style
    } = parseVariant(variant);
    const family = fontFamily.replace(/ /g, '_');
    /* fontUrl is proxyable from api.hubspot(qa).com */
    const url = getFontUrl(family, variant);
    return `${acc}@font-face {
        font-family: "${fontFamily}";
        src: url("${url}.woff2") format("woff2"), url("${url}.woff") format("woff");
        font-weight: ${weight};
        font-style: ${style};
        font-display: swap;
      }\n`;
  }, '');
  return fontStylesheet;
}