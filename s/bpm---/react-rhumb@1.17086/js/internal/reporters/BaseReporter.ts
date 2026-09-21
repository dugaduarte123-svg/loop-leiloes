import enviro from 'enviro';
import Raven from 'raven-js';
import { captureException } from '../ravenUtils';
import { GlobalErrorMetrics } from '../Metrics';
import { UNEXPECTED_ROUTE_ERROR } from '../Constants';
import { getStaticAppName, getStaticAppVersion } from '../staticAppInfo';
import { getWasHiddenOnScriptStart, visibilityState, onVisibilityChange } from '../visibility';
import { cleanseRoute } from '../cleanseRoute';
export const Color = {
  OBSIDIAN: '#33475b',
  OZ: '#00bda5',
  OZ_LIGHT: '#e5f8f6',
  OZ_DARK: '#00a38d',
  CANDY_APPLE_DARK: '#d94c53',
  SLINKY: '#516f90',
  KOALA: '#eaf0f6',
  MARIGOLD: '#f5c26b',
  MARIGOLD_LIGHT: '#fef8f0',
  CANDY_APPLE_LIGHT: '#fdedee',
  CANDY_APPLE: '#f2545b',
  THUNDERDOME: '#6a78d1',
  THUNDERDOME_LIGHT: '#f0f1fa'
};
export default class BaseReporter {
  constructor(options = {}) {
    this.wasHidden = false;
    this._destroyVisibilityListener = () => {};
    this.resolved = {};
    this.options = options;
    this.staticAppName = getStaticAppName(options.staticAppInfo);
    this.staticAppVersion = getStaticAppVersion(options.staticAppInfo);
    this.debug = enviro.debug('react-rhumb') === 'true' || enviro.debug(`${this.staticAppName}.react-rhumb`) === 'true';
    this.libName = `react-rhumb`;
    this.softNavigationContext = options.softNavigationContext;
  }
  initVisibilityTracking() {
    this.wasHidden = getWasHiddenOnScriptStart() || visibilityState() === 'hidden';
    this._destroyVisibilityListener = onVisibilityChange(() => {
      if (!this.wasHidden) {
        this.wasHidden = true;
      }
    });
  }
  buildMetricsDimensions(route, isAiCopilotEnabled, extra) {
    var _this$options$isGrani, _this$options$isGrani2;
    return Object.assign({
      route: cleanseRoute(route),
      isAiCopilotEnabled,
      isGraniteEnabled: String((_this$options$isGrani = this.options.isGraniteEnabled) !== null && _this$options$isGrani !== void 0 ? _this$options$isGrani : false),
      isGraniteRemoteApp: String((_this$options$isGrani2 = this.options.isGraniteRemoteApp) !== null && _this$options$isGrani2 !== void 0 ? _this$options$isGrani2 : false)
    }, extra);
  }
  getAdjustedDurationMs(successTimestamp, fallbackMs) {
    return this.softNavigationContext ? successTimestamp - this.softNavigationContext.timestamp : fallbackMs;
  }
  getBaseTime(entryTimestamp) {
    return this.softNavigationContext ? this.softNavigationContext.timestamp : entryTimestamp;
  }
  toReportedDurationMs(checks, totalTimeFromRouteStart, markers) {
    const {
      duration,
      timestamp
    } = this.toTimings(checks, totalTimeFromRouteStart, markers);
    return this.getAdjustedDurationMs(timestamp, duration + totalTimeFromRouteStart);
  }
  computeTimeoutDurationMs(expiredTimestamp, totalTimeFromRouteStart) {
    const raw = Math.max(0, expiredTimestamp - totalTimeFromRouteStart);
    return this.getAdjustedDurationMs(expiredTimestamp, raw + totalTimeFromRouteStart);
  }
  performanceMark(name, markOptions) {
    if (typeof performance.mark === 'function') {
      performance.mark(name, markOptions);
    }
  }
  performanceEntries() {
    if (typeof performance.getEntries === 'function') {
      return performance.getEntries() || [];
    }
    return [];
  }
  toTimings(checks, baseTime, markers) {
    let selector;
    let longest = -Infinity;
    markers.forEach(marker => {
      if (Object.prototype.hasOwnProperty.call(checks, marker) && checks[marker].timestamp > longest) {
        longest = checks[marker].timestamp;
        selector = marker;
      }
    });
    return {
      duration: Math.max(0, longest - baseTime),
      timestamp: Math.max(0, longest),
      selector
    };
  }
  setCustomAttribute(attributeName, attributeValue) {
    Raven.setExtraContext({
      [attributeName]: String(attributeValue)
    });
  }
  captureError(error, attributes) {
    let data = {};
    let tags = {};
    if (attributes) {
      data = attributes.data;
      tags = attributes.tags;
    }
    captureException(error, {
      extra: data,
      tags
    });
    GlobalErrorMetrics.counter('captured').increment();
  }
  isResolved(id) {
    return !!this.resolved[id];
  }
  markResolved(id) {
    this.resolved[id] = true;
  }
  report(__action) {
    throw new Error('Reporters must define a custom report() function');
  }
  destroy() {
    this._destroyVisibilityListener();
  }
  labelCss(background, border) {
    return `background-color:${background};color:${Color.OBSIDIAN};padding: 0 .5rem;border-left: 4px solid ${border};`;
  }
  colorCss(val) {
    return `color:${val};`;
  }
  logGroupWithBadge(title, lightColor, darkColor, groupContents) {
    let loggedAppName = this.libName;
    try {
      // If we're logging from an app within an iframe, include the app name in the log line
      if (window.self !== window.top) {
        loggedAppName += ` (child frame: ${this.staticAppName})`;
      }
    } catch (error) {
      // Accessing window.top can throw an error if the iframe and parent window have different domains,
      // so an error thrown here is another indicator that this is being called from within an iframe
      loggedAppName += ` (child frame: ${this.staticAppName})`;
    }
    console.groupCollapsed(`%c${loggedAppName}%c ${title}`, this.labelCss(lightColor, darkColor), '');
    groupContents();
    console.groupEnd();
  }
  captureUnexpectedRoute(pathname) {
    captureException(UNEXPECTED_ROUTE_ERROR, {
      level: 'error',
      tags: {
        pathname
      }
    });
  }
}