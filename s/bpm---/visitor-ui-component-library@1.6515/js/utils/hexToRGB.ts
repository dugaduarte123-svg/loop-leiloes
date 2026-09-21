export const hexToRGB = hexColorValue => {
  let colorValue = (hexColorValue || '#000000').slice(1);
  if (colorValue.length === 3) {
    colorValue = colorValue.replace(/(.)/g, '$1$1');
  }
  const r = parseInt(colorValue.slice(0, 2), 16);
  const g = parseInt(colorValue.slice(2, 4), 16);
  const b = parseInt(colorValue.slice(4, 6), 16);
  return {
    r,
    g,
    b
  };
};