import { isEmbeddedInProduct } from '../utils/isEmbeddedInProduct';
import { addAuthToRequest } from './addAuthToRequest';
const MESSAGES_URI_HEADER = 'X-HubSpot-Messages-Uri';
const XHR_DONE_STATE = 4;
export const WIDGET_WILL_LOAD_CODES = [200, 304];
export const EXPECTED_WIDGET_WILL_NOT_LOAD_CODES = [204, 404];
const shouldLoad = statusCode => WIDGET_WILL_LOAD_CODES.indexOf(statusCode) > -1;
const requestFailed = statusCode => !shouldLoad(statusCode) && EXPECTED_WIDGET_WILL_NOT_LOAD_CODES.indexOf(statusCode) < 0;
const noop = () => {};

/**
 *
 * @param {object} options
 * @param {string} options.requestUrl
 * @param {number} options.portalId
 * @param {function} loadCallback
 * @param {function} [noopCallback=noop]
 */
export function fetchWidgetData({
  requestUrl,
  portalId
}, loadCallback, noopCallback = noop) {
  var _window;
  const request = new XMLHttpRequest();
  request.addEventListener('readystatechange', () => {
    if (request.readyState !== XHR_DONE_STATE) {
      return;
    }
    if (shouldLoad(request.status)) {
      try {
        const json = JSON.parse(request.responseText);
        loadCallback(json);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Initial messages API response is invalid');
        noopCallback();
      }
      return;
    }
    if (requestFailed(request.status)) {
      // eslint-disable-next-line no-console
      console.warn('Initial messages API call failed');
    }
    noopCallback();
  });
  request.open('GET', requestUrl);
  const messagesPageUriOverride = (_window = window) === null || _window === void 0 || (_window = _window.messagesConfig) === null || _window === void 0 ? void 0 : _window.messagesPageUri;
  let href;
  if (messagesPageUriOverride) {
    href = messagesPageUriOverride;
  } else if (window.location.href === 'about:srcdoc') {
    var _window$top$location$, _window$top;
    href = (_window$top$location$ = (_window$top = window.top) === null || _window$top === void 0 ? void 0 : _window$top.location.href) !== null && _window$top$location$ !== void 0 ? _window$top$location$ : window.location.href;
  } else {
    href = window.location.href;
  }
  request.setRequestHeader(MESSAGES_URI_HEADER, href);
  if (isEmbeddedInProduct({
    portalId
  })) {
    addAuthToRequest(request);
  }
  request.send();
}