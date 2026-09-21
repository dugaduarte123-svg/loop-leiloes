"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._sendBeacon = _sendBeacon;
exports.send = send;
exports.setBeaconApi = setBeaconApi;
exports.setStaticAppInfo = setStaticAppInfo;
var _enviro = _interopRequireDefault(require("enviro"));
var _getGlobal = require("./getGlobal");
// need to support the React Native globalThis
let _customSendBeaconFn;
function _sendBeacon(url, data) {
  const global = (0, _getGlobal.getGlobal)();
  if (_customSendBeaconFn) {
    return _customSendBeaconFn(url, data);
  }
  return global.navigator && global.navigator.sendBeacon(url, data);
}
function sendBeacon(url, data = '') {
  if (!_sendBeacon) {
    return;
  }
  try {
    const sent = _sendBeacon(url, data);
    if (sent === false && _enviro.default.debug('METRICS')) {
      console.error('[metrics-js] sendBeacon returned false, beacon was dropped');
    }
  } catch (___err) {
    if (_enviro.default.debug('METRICS')) {
      console.error('[metrics-js] Failed to send metric ', ___err);
    }
  }
}
function setBeaconApi(beaconFn) {
  _customSendBeaconFn = beaconFn;
}
// Frame chains shouldn't get anywhere near this deep.
const MAX_FRAME_DEPTH = 20;
/**
 * Collapse the high-cardinality bits of a URL so it can be grouped/filtered:
 * every run of digits becomes `:number` (portal ids, record ids, etc.).
 */
function normalizeUrl(url) {
  return url.replace(/\d+/g, ':number');
}

/**
 * Read a single frame's location, normalized for filtering. Returns
 * `'cross-origin'` when the frame is unreadable, or `undefined` when there is
 * no such frame or it has no location.
 */
function readFrameUrl(frame) {
  if (!frame) return undefined;
  try {
    const href = frame.location && frame.location.href;
    return href ? normalizeUrl(href) : undefined;
  } catch (___err) {
    return 'cross-origin';
  }
}

/**
 * Walk the frame ancestor chain and collect each frame's URL and
 * `window.hubspot.bender` value for diagnostic purposes. Reading properties
 * off a cross-origin ancestor throws, so each hop is guarded.
 */
function collectFrameDiagnostics() {
  const frames = [];
  let frame = (0, _getGlobal.getGlobal)();
  for (let depth = 0; frame && depth < MAX_FRAME_DEPTH; depth += 1) {
    var _url, _bender;
    let url = null;
    let bender;
    try {
      url = frame.location && frame.location.href;
      bender = frame.hubspot && frame.hubspot.bender;
    } catch (___err) {
      // Cross-origin — record what we know and stop climbing.
      frames.push({
        url: '[cross-origin]',
        bender: null
      });
      break;
    }
    frames.push({
      url: (_url = url) !== null && _url !== void 0 ? _url : null,
      bender: (_bender = bender) !== null && _bender !== void 0 ? _bender : null
    });
    const parent = frame.parent;
    if (!parent || parent === frame) break;
    frame = parent;
  }
  return frames;
}

/**
 * Build the flat, low-cardinality frame fields for the Raven `extra` payload,
 * plus the full collected chain for detail. The normalized `*FrameUrl` fields
 * are meant to be filtered on directly in logfetch.
 */
function getFrameExtra() {
  const self = (0, _getGlobal.getGlobal)();
  const parent = self && self.parent !== self ? self.parent : undefined;
  const top = self && self.top !== self ? self.top : undefined;
  return {
    currentFrameUrl: readFrameUrl(self),
    parentFrameUrl: readFrameUrl(parent),
    topFrameUrl: readFrameUrl(top),
    frameDiagnostics: collectFrameDiagnostics()
  };
}
const staticAppInfo = {
  package: (0, _getGlobal.getHubSpot)() && (0, _getGlobal.getHubSpot)().bender && (0, _getGlobal.getHubSpot)().bender.currentProject || 'unknown',
  version: (0, _getGlobal.getHubSpot)() && (0, _getGlobal.getHubSpot)().bender && (0, _getGlobal.getHubSpot)().bender.currentProjectVersion || 'unknown'
};
function setStaticAppInfo(newInfo) {
  Object.assign(staticAppInfo, newInfo);
}
function getMetricsJsVersion() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('current-package-loader!').version;
  } catch (_err) {
    return 'unknown';
  }
}
const METRICS_JS_VERSION = getMetricsJsVersion();
function getMetricsUrl() {
  const hublet =
  // referencing 'na1' from hubspot-url-utils causes a circular dependency
  // eslint-disable-next-line hubspot-dev/no-hublet-references
  typeof _enviro.default.getHublet === 'function' ? _enviro.default.getHublet() : 'na1';
  return `https://metrics-fe-${hublet}.hubspot${_enviro.default.isQa() ? 'qa' : ''}.com/metrics/v1/frontend/custom/send?hs_static_app=${staticAppInfo.package}&hs_static_app_version=${staticAppInfo.version}&metrics_js_version=${METRICS_JS_VERSION}`;
}
function send(metricReports) {
  if (staticAppInfo.package === 'unknown' || !staticAppInfo.package) {
    const error = new Error('metrics-js: hs_static_app is unknown, cannot send metrics to backend');
    console.error('[metrics-js] hs_static_app is unknown, dropping metrics', error);
    if (_enviro.default.deployed('METRICS')) {
      const Raven = (0, _getGlobal.getGlobal)().Raven;
      if (Raven) {
        Raven.captureException(error, {
          extra: Object.assign({
            metricReports,
            staticAppInfo
          }, getFrameExtra())
        });
      } else if (_enviro.default.isQa()) {
        throw error;
      }
    }
    return;
  }

  // to test actually sending locally, run `sessionStorage.setItem('METRICS_DEPLOYED', 'true'); enviro.setDebug('METRICS', true);` in console
  if (!_enviro.default.deployed('METRICS')) {
    if (_enviro.default.debug('METRICS')) {
      console.log('[metrics-js] Dropping local datapoint', metricReports);
    }
    return;
  }
  if (_enviro.default.debug('METRICS')) {
    console.log('[metrics-js] Datapoint sent', metricReports);
  }
  sendBeacon(getMetricsUrl(), JSON.stringify(metricReports));
}