import { createContext, useContext } from 'react';
import { spotlightTheme } from './theme';

/**
 * Provides spotlight design tokens to all child components.
 * Defaults to the standard spotlight theme — wrap with SpotlightThemeProvider
 * to supply a custom override.
 */
const SpotlightThemeContext = /*#__PURE__*/createContext(spotlightTheme);
SpotlightThemeContext.displayName = 'SpotlightThemeContext';
export const useSpotlightTheme = () => useContext(SpotlightThemeContext);
export default SpotlightThemeContext;