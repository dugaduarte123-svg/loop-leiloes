export const isAcceptanceTest = () => {
  return !!window.navigator.webdriver;
};

// prerendering is only available in Chromium

export const isPrerendering = () => {
  var _window;
  return !!((_window = window) !== null && _window !== void 0 && (_window = _window.document) !== null && _window !== void 0 && _window.prerendering);
};