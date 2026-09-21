import { ThemeProvider } from 'styled-components';
import SpotlightThemeContext from './SpotlightThemeContext';
import { spotlightTheme } from './theme';
import { jsx as _jsx } from "react/jsx-runtime";
const SpotlightThemeProvider = ({
  children,
  theme = spotlightTheme
}) => /*#__PURE__*/_jsx(SpotlightThemeContext.Provider, {
  value: theme,
  children: /*#__PURE__*/_jsx(ThemeProvider, {
    theme: outer => Object.assign({}, outer, {
      spotlight: theme
    }),
    children: children
  })
});
SpotlightThemeProvider.displayName = 'SpotlightThemeProvider';
export default SpotlightThemeProvider;