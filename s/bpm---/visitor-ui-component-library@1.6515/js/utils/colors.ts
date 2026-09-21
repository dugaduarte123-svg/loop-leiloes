// @ts-ignore untyped
import HexCodePattern from 'PatternValidationJS/patterns/HexCode';
const RGB_REGEX = /^rgb/i;

// shimmed as we cannot depend on HubStyleTokens
const OLAF = '#ffffff';
const OBSIDIAN = '#33475b';
const SHORTHAND_HEX_PATTERN = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
const REGULAR_HEX_PATTERN = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
let canReadTextVal;
let lastAccent;

/**
 * Returns the RGB channel values for a given color.
 *
 * Adapted from https://git.hubteam.com/HubSpot/UIComponents/blob/ec74b487b599e14bc7454afa65961e7ab0553f4d/UIComponents/static/js/core/Color.ts
 *
 * @param {string} color - A color in hex, rgb(), or rgba() format
 * @returns {object} An object of the form { r, g, b }
 */
export const getRGB = color => {
  let r;
  let g;
  let b;
  try {
    if (RGB_REGEX.test(color)) {
      const match = color.match(/(\d+)\D+(\d+)\D+(\d+)/) || [];
      r = parseInt(match[1], 10);
      g = parseInt(match[2], 10);
      b = parseInt(match[3], 10);
    } else {
      let hexColor = color.toLowerCase().replace(/^#/, '');
      if (hexColor.length === 3) hexColor = hexColor.replace(/([0-9a-f])/g, '$1$1');
      r = parseInt(hexColor.substring(0, 2), 16);
      g = parseInt(hexColor.substring(2, 4), 16);
      b = parseInt(hexColor.substring(4, 6), 16);
    }
    if ([r, g, b].some(isNaN)) return {};
  } catch (err) {
    return {};
  }
  return {
    r,
    g,
    b
  };
};

/**
 * Converts given color string first to RGB and then to HSL using the following conversion:
 * https://gist.github.com/mjackson/5311256#file-color-conversion-algorithms-js-L1-L34
 *
 * Based on the math behind: https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB
 */
export const convertToHsl = hex => {
  const {
    r,
    g,
    b
  } = getRGB(hex);
  if ([r, g, b].some(val => Number.isNaN(Number(val)))) {
    return {
      hue: 0,
      saturation: 0,
      lightness: 0
    };
  }
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;
  if (delta === 0) {
    return {
      hue: 0,
      saturation: 0,
      lightness
    };
  }
  let hue;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  switch (max) {
    case red:
      hue = (green - blue) / delta + (green < blue ? 6 : 0);
      break;
    case green:
      hue = (blue - red) / delta + 2;
      break;
    default:
      hue = (red - green) / delta + 4;
      break;
  }
  hue *= 60;
  hue = Math.round(hue);
  return {
    hue,
    saturation,
    lightness
  };
};
const decimalToPercent = decimal => {
  const boundedDecimal = decimal < 0 ? 0 : decimal > 1 ? 1 : decimal;
  return `${Math.round(boundedDecimal * 100)}%`;
};

/**
 * Given any hex string representation of a color, returns the HSL format of that color lightened.
 *
 * @param {string} hex hexidecimal representation of a color string
 * @param {number} amount a float representing percentage increase (0 to 1). default is 0.1
 */
export const lighten = (hex, amount = 0.1) => {
  const {
    hue,
    saturation,
    lightness
  } = convertToHsl(hex);
  return `hsl(${[hue, decimalToPercent(saturation), decimalToPercent(lightness + amount)].join(', ')})`;
};

/**
 * Given any hex string representation of a color, returns the HSL format of that color darkened.
 *
 * @param {string} hex hexidecimal representation of a color string
 * @param {number} amount a float representing percentage decrease (0 to 1). default is 0.1
 */
export const darken = (hex, amount = 0.1) => {
  return lighten(hex, -amount);
};
export function hexToRgb(hex) {
  try {
    const regularHex = hex.replace(SHORTHAND_HEX_PATTERN, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });
    const result = REGULAR_HEX_PATTERN.exec(regularHex);
    if (!result) {
      throw new Error('Invalid hex code');
    }
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  } catch (error) {
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error(`Error converting hex ${hex} to rgb: ${error.message}`);
    }
    return {
      r: 0,
      g: 0,
      b: 0
    };
  }
}
function getLightness(hex) {
  const {
    r: rRaw,
    g: gRaw,
    b: bRaw
  } = hexToRgb(hex);
  const r = rRaw / 255.0;
  const rLightness = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const g = gRaw / 255.0;
  const gLightness = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const b = bRaw / 255.0;
  const bLightness = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  return 0.2126 * rLightness + 0.7152 * gLightness + 0.0722 * bLightness;
}
export function canReadText(backgroundHex, textColor) {
  const backLightness = getLightness(backgroundHex);
  const textLightness = getLightness(textColor);
  const contrastRatio = (textLightness + 0.05) / (backLightness + 0.05);
  return contrastRatio > 2.0;
}
export function getCanReadTextOnce(accent) {
  if (accent !== lastAccent) {
    lastAccent = accent;
    canReadTextVal = canReadText(accent, OLAF);
  }
  return canReadTextVal;
}
export function getTextColor(accent) {
  if (!HexCodePattern.test(accent)) {
    return OBSIDIAN;
  }
  return getCanReadTextOnce(accent) ? OLAF : OBSIDIAN;
}
export function useDefaultElementColor(accent) {
  if (!HexCodePattern.test(accent)) {
    return true;
  }
  return !getCanReadTextOnce(accent);
}