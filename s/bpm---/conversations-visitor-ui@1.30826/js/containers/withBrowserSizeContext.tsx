import { BrowserWindowContext } from '../components/BrowserWindowContext';
import { jsx as _jsx } from "react/jsx-runtime";
export function withBrowserSizeContext(Component) {
  const WithBrowserSizeContext = props => /*#__PURE__*/_jsx(BrowserWindowContext.Consumer, {
    children: ({
      browserWindowHeight,
      browserWindowWidth
    }) => /*#__PURE__*/_jsx(Component, Object.assign({}, props, {
      browserWindowHeight: browserWindowHeight,
      browserWindowWidth: browserWindowWidth
    }))
  });
  WithBrowserSizeContext.displayName = `withBrowserSizeContext(${Component.displayName || Component.name || 'Component'})`;
  return WithBrowserSizeContext;
}