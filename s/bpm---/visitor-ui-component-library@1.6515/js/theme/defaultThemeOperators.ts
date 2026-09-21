import { curryable } from '../utils/curryable';
export const getThemeProperty = curryable((type, key, theme) => {
  if (typeof theme !== 'object' || theme === null) {
    throw new Error(`Error getting '${key}': the theme for VizExComponents has not been defined. Please provide a theme through the component props or styled-components ThemeProvider.`);
  }
  if (typeof theme[type] !== 'object' || theme[type] === null) {
    throw new Error(`Error getting 'theme.${type}': the theme object is missing ${type} property. Please ensure the ${type} was defined on theme.`);
  }
  if (!theme[type][key]) {
    throw new Error(`Error getting '${key}': the property was not defined on theme.`);
  }
  return theme[type][key];
});
export const setThemeProperty = curryable((type, key, value, theme) => {
  return Object.assign({}, theme, {
    [type]: Object.assign({}, theme[type], {
      [key]: value
    })
  });
});
export function setThemeColorsProperty(property) {
  return setThemeProperty('colors')(property);
}
export function getThemeColorsProperty(property) {
  return getThemeProperty('colors')(property);
}
export function setThemeFontProperty(property) {
  return setThemeProperty('font')(property);
}
export const getPrimaryColor = getThemeColorsProperty('primary');
export const setPrimaryColor = setThemeColorsProperty('primary');
export const getTextColor = getThemeColorsProperty('text');
export const setTextColor = setThemeColorsProperty('text');
export const getTextOnPrimaryColor = getThemeColorsProperty('textOnPrimary');
export const setTextOnPrimaryColor = setThemeColorsProperty('textOnPrimary');
export const getErrorTextColor = getThemeColorsProperty('errorText');
export const setErrorTextColor = setThemeColorsProperty('errorText');
export const getDisabledBackgroundColor = getThemeColorsProperty('disabledBackground');
export const setDisabledBackgroundColor = setThemeColorsProperty('disabledBackground');
export const getDisabledTextColor = getThemeColorsProperty('disabledText');
export const setDisabledTextColor = setThemeColorsProperty('disabledText');
export const getDisabledButtonBackground = getThemeColorsProperty('disabledButtonBackground');
export const setDisabledButtonBackground = setThemeColorsProperty('disabledButtonBackground');
export const getDisabledButtonBorderColor = getThemeColorsProperty('disabledButtonBorder');
export const setDisabledButtonBorderColor = setThemeColorsProperty('disabledButtonBorder');
export const getDisabledButtonTextColor = getThemeColorsProperty('disabledButtonText');
export const setDisabledButtonTextColor = setThemeColorsProperty('disabledButtonText');
export const setPlaceholderTextColor = setThemeColorsProperty('placeholderText');
export const getPlaceholderTextColor = getThemeColorsProperty('placeholderText');
export const getInputBorderColor = theme => getThemeColorsProperty('updatedInputBorder')(theme);
export const setInputBorderColor = setThemeColorsProperty('inputBorder');
export const setUpdatedBorderColor = setThemeColorsProperty('updatedInputBorder');
export const getInputBackgroundColor = getThemeColorsProperty('inputBackground');
export const setInputBackgroundColor = setThemeColorsProperty('inputBackground');
export const setHelpTextColor = setThemeColorsProperty('helpText');
export const getHelpTextColor = getThemeColorsProperty('helpText');
export const setFontFamily = setThemeFontProperty('fontFamily');
export const getFontFamily = getThemeColorsProperty('fontFamily');