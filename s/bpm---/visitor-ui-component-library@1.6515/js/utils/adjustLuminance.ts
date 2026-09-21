import { hexToRGB } from './hexToRGB';
export const adjustLuminance = (colorHex, luminanceShiftPercentage) => {
  const {
    r,
    g,
    b
  } = hexToRGB(colorHex);
  const newRedColor = /* eslint-disable-next-line no-bitwise */
  0 | (1 << 8) + r + (256 - r) * luminanceShiftPercentage / 100;
  const redHex = `0${newRedColor.toString(16).slice(1)}`.slice(-2);
  const newGreenColor = /* eslint-disable-next-line no-bitwise */
  0 | (1 << 8) + g + (256 - g) * luminanceShiftPercentage / 100;
  const greenHex = `0${newGreenColor.toString(16).slice(1)}`.slice(-2);
  const newBlueColor = /* eslint-disable-next-line no-bitwise */
  0 | (1 << 8) + b + (256 - b) * luminanceShiftPercentage / 100;
  const blueHex = `0${newBlueColor.toString(16).slice(1)}`.slice(-2);
  return `#${redHex}${greenHex}${blueHex}`;
};