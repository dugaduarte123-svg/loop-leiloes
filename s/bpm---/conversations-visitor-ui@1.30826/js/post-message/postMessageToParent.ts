import { getWidgetShellUUID } from '../query-params/getWidgetShellUUID';
import { isDetachedWindow } from '../query-params/isDetachedWindow';
const getPostMessageTarget = () => {
  var _ref, _window$opener$parent, _window$opener;
  return isDetachedWindow() ? (_ref = (_window$opener$parent = (_window$opener = window.opener) === null || _window$opener === void 0 ? void 0 : _window$opener.parent) !== null && _window$opener$parent !== void 0 ? _window$opener$parent : window.opener) !== null && _ref !== void 0 ? _ref : window.parent : window.parent;
};
export const postMessageToParent = (type, data) => {
  try {
    const uuid = getWidgetShellUUID();
    const target = getPostMessageTarget();
    target.postMessage(JSON.stringify({
      type,
      data,
      uuid
    }), '*');
    return {
      type,
      data
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error posting message to parent', e);
  }
};