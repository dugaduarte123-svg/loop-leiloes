import { ThemeProvider } from 'styled-components';
import VizExGlobalStyle from '../global/VizExGlobalStyle';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const VizExThemeProvider = ({
  theme,
  children
}) => /*#__PURE__*/_jsxs(ThemeProvider, {
  theme: theme,
  children: [children, /*#__PURE__*/_jsx(VizExGlobalStyle, {})]
});
VizExThemeProvider.displayName = 'VizExThemeProvider';
export default VizExThemeProvider;