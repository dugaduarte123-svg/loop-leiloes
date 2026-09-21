export const postMessageToIframe = ({
  iframe,
  iframeSrc,
  type,
  data
}) => {
  var _win;
  let win;
  try {
    win = iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow;
  } catch (e) {
    win = iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow;
  }
  return (_win = win) === null || _win === void 0 ? void 0 : _win.postMessage(JSON.stringify({
    type,
    data
  }), iframeSrc);
};