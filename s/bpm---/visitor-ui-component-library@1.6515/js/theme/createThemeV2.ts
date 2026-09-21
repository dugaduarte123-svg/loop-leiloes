import { defaultTheme } from './defaultTheme';
import { mergeDeep } from '../utils/mergeDeep';

/**
 * Creates the theme object to customize the components based on the passed overrides.
 *
 * @param overrides A theme configuration object to merge/override the default values.
 * @returns The theme object used internally by the component library.
 */
export const createThemeV2 = (themeOverride = {}) => {
  return themeOverride.colors || themeOverride.font || themeOverride.components ? mergeDeep(defaultTheme, themeOverride) : defaultTheme;
};