import { onLCP, onINP, onCLS, onFCP } from 'web-vitals/attribution';
import enviro from 'enviro';
import { captureException } from '../ravenUtils';
import CartographerReporter, { THIRTY_SECONDS } from './CartographerReporter';
import { onVisibilityHidden } from '../visibility';
import { getElementSelector, getNearestComponentName } from '../elementSelector';
import performanceNow from '../../vendor/performanceNow';
import PageStateTracker from '../PageStateTracker';
import PerformanceEventBus from '../PerformanceEventBus';
import { isInIframe } from '../browserAccessors';
const WEB_VITALS_ADAPTER_ENABLED = true;
export function isWebVitalsAdapterEnabled() {
  if (typeof Array.prototype.at !== 'function') return false;
  return WEB_VITALS_ADAPTER_ENABLED || enviro.debug('react-rhumb-web-vitals-adapter') === 'true';
}
export default class WebVitalsAdapter extends CartographerReporter {
  static getInstance(options) {
    const w = window;
    if (!w[WebVitalsAdapter.WINDOW_KEY]) {
      w[WebVitalsAdapter.WINDOW_KEY] = new WebVitalsAdapter(options);
    }
    return w[WebVitalsAdapter.WINDOW_KEY];
  }
  static resetInstance() {
    window[WebVitalsAdapter.WINDOW_KEY] = undefined;
  }
  getPageState() {
    const pageStateTracker = PageStateTracker.getInstance();
    const pageStateSummary = pageStateTracker.getStateSummary();
    const currentSnapshot = pageStateTracker.getSnapshot();
    return {
      currentOnline: currentSnapshot.online,
      currentHidden: currentSnapshot.hidden,
      wasEverHidden: pageStateSummary.wasEverHidden,
      wasEverOffline: pageStateSummary.wasEverOffline
    };
  }
  handleSoftNavLCP(metric) {
    var _attribution$target, _lcpEntry$element, _performance$getEntri, _performance, _fcpEntry$startTime, _lcpEntry$size, _attribution$elementR;
    const {
      attribution
    } = metric;
    const lcpEntry = attribution.lcpEntry;
    const element = lcpEntry !== null && lcpEntry !== void 0 && lcpEntry.element ? getElementSelector(lcpEntry.element) : (_attribution$target = attribution.target) !== null && _attribution$target !== void 0 ? _attribution$target : '';
    const componentName = getNearestComponentName((_lcpEntry$element = lcpEntry === null || lcpEntry === void 0 ? void 0 : lcpEntry.element) !== null && _lcpEntry$element !== void 0 ? _lcpEntry$element : null);
    const fcpEntry = (_performance$getEntri = (_performance = performance).getEntriesByType) === null || _performance$getEntri === void 0 || (_performance$getEntri = _performance$getEntri.call(_performance, 'paint')) === null || _performance$getEntri === void 0 ? void 0 : _performance$getEntri.find(e => e.name === 'first-contentful-paint');
    const fcpTime = (_fcpEntry$startTime = fcpEntry === null || fcpEntry === void 0 ? void 0 : fcpEntry.startTime) !== null && _fcpEntry$startTime !== void 0 ? _fcpEntry$startTime : 0;
    const isEmbedded = isInIframe();
    const elementRenderTimestamp = (lcpEntry === null || lcpEntry === void 0 ? void 0 : lcpEntry.renderTime) || (lcpEntry === null || lcpEntry === void 0 ? void 0 : lcpEntry.loadTime) || metric.value;
    this.pushPerformanceAction(this.lastRouteInfo, 'web-vitals-soft-nav-lcp', {
      size: (_lcpEntry$size = lcpEntry === null || lcpEntry === void 0 ? void 0 : lcpEntry.size) !== null && _lcpEntry$size !== void 0 ? _lcpEntry$size : 0,
      value: metric.value,
      elementRenderTimestamp,
      elementLoadTimestamp: lcpEntry === null || lcpEntry === void 0 ? void 0 : lcpEntry.loadTime,
      elementRenderDelay: (_attribution$elementR = attribution.elementRenderDelay) !== null && _attribution$elementR !== void 0 ? _attribution$elementR : 0,
      id: metric.id,
      url: lcpEntry === null || lcpEntry === void 0 ? void 0 : lcpEntry.url,
      element,
      componentName,
      isEmbedded,
      fcpTime,
      navigationId: metric.navigationId,
      elapsedMs: performanceNow(),
      pageState: this.getPageState(),
      webVitalsSource: true
    });
    this.debounceFlush();
  }
  handleHardNavLCP(metric) {
    var _attribution$target2, _lcpEntry$element2, _performance$getEntri2, _performance2, _fcpEntry$startTime2, _entryJson$entryType, _entryJson$size, _entryJson$startTime, _entryJson$loadTime, _entryJson$id, _ref, _entryJson$url;
    const {
      attribution
    } = metric;
    const lcpEntry = attribution.lcpEntry;
    const element = lcpEntry !== null && lcpEntry !== void 0 && lcpEntry.element ? getElementSelector(lcpEntry.element) : (_attribution$target2 = attribution.target) !== null && _attribution$target2 !== void 0 ? _attribution$target2 : '';
    const componentName = getNearestComponentName((_lcpEntry$element2 = lcpEntry === null || lcpEntry === void 0 ? void 0 : lcpEntry.element) !== null && _lcpEntry$element2 !== void 0 ? _lcpEntry$element2 : null);
    const fcpEntry = (_performance$getEntri2 = (_performance2 = performance).getEntriesByType) === null || _performance$getEntri2 === void 0 || (_performance$getEntri2 = _performance$getEntri2.call(_performance2, 'paint')) === null || _performance$getEntri2 === void 0 ? void 0 : _performance$getEntri2.find(e => e.name === 'first-contentful-paint');
    const fcpTime = (_fcpEntry$startTime2 = fcpEntry === null || fcpEntry === void 0 ? void 0 : fcpEntry.startTime) !== null && _fcpEntry$startTime2 !== void 0 ? _fcpEntry$startTime2 : 0;
    const isEmbedded = isInIframe();
    const entryJson = lcpEntry ? lcpEntry.toJSON() : null;
    const rawRenderTime = (entryJson === null || entryJson === void 0 ? void 0 : entryJson.renderTime) || (entryJson === null || entryJson === void 0 ? void 0 : entryJson.loadTime) || metric.value;
    this.pushPerformanceAction(this.lastRouteInfo, 'largest-contentful-paint', {
      entryType: (_entryJson$entryType = entryJson === null || entryJson === void 0 ? void 0 : entryJson.entryType) !== null && _entryJson$entryType !== void 0 ? _entryJson$entryType : 'largest-contentful-paint',
      size: (_entryJson$size = entryJson === null || entryJson === void 0 ? void 0 : entryJson.size) !== null && _entryJson$size !== void 0 ? _entryJson$size : 0,
      startTime: (_entryJson$startTime = entryJson === null || entryJson === void 0 ? void 0 : entryJson.startTime) !== null && _entryJson$startTime !== void 0 ? _entryJson$startTime : metric.value,
      renderTime: rawRenderTime,
      loadTime: (_entryJson$loadTime = entryJson === null || entryJson === void 0 ? void 0 : entryJson.loadTime) !== null && _entryJson$loadTime !== void 0 ? _entryJson$loadTime : 0,
      id: (_entryJson$id = entryJson === null || entryJson === void 0 ? void 0 : entryJson.id) !== null && _entryJson$id !== void 0 ? _entryJson$id : '',
      url: (_ref = (_entryJson$url = entryJson === null || entryJson === void 0 ? void 0 : entryJson.url) !== null && _entryJson$url !== void 0 ? _entryJson$url : attribution.url) !== null && _ref !== void 0 ? _ref : '',
      element,
      componentName,
      isEmbedded,
      fcpTime,
      elementRenderDelay: Math.max(rawRenderTime - fcpTime, 0),
      isReload: metric.navigationType === 'reload',
      status: this.lastStatus,
      failureType: this.lastFailureType,
      elapsedMs: performanceNow(),
      pageState: this.getPageState(),
      webVitalsSource: true
    });
    this.debounceFlush();
  }
  constructor(options) {
    super(options);
    this.debounceFlush = () => {
      clearTimeout(this.flushQueueTimeout);
      this.flushQueueTimeout = setTimeout(() => {
        this.flushPerformanceQueue();
      }, THIRTY_SECONDS);
    };
    this.handleLCP = metric => {
      try {
        if (metric.navigationType === 'soft-navigation') {
          this.handleSoftNavLCP(metric);
        } else {
          this.handleHardNavLCP(metric);
        }
      } catch (e) {
        captureException(e instanceof Error ? e : new Error(String(e)));
      }
    };
    this.handleINP = metric => {
      try {
        var _metric$entries, _targetEl$hasAttribut, _targetEl$getAttribut, _attribution$interact, _interactionId, _metric$entries2, _attribution$interact2;
        const {
          attribution
        } = metric;
        const targetEl = (_metric$entries = metric.entries) === null || _metric$entries === void 0 || (_metric$entries = _metric$entries[0]) === null || _metric$entries === void 0 ? void 0 : _metric$entries.target;
        const testId = targetEl && (_targetEl$hasAttribut = targetEl.hasAttribute) !== null && _targetEl$hasAttribut !== void 0 && _targetEl$hasAttribut.call(targetEl, 'data-test-id') ? (_targetEl$getAttribut = targetEl.getAttribute('data-test-id')) !== null && _targetEl$getAttribut !== void 0 ? _targetEl$getAttribut : '' : '';
        const tagName = targetEl ? getElementSelector(targetEl) : (_attribution$interact = attribution.interactionTarget) !== null && _attribution$interact !== void 0 ? _attribution$interact : '';
        const componentName = getNearestComponentName(targetEl !== null && targetEl !== void 0 ? targetEl : null);
        const interactionId = (_interactionId = (_metric$entries2 = metric.entries) === null || _metric$entries2 === void 0 || (_metric$entries2 = _metric$entries2[0]) === null || _metric$entries2 === void 0 ? void 0 : _metric$entries2.interactionId) !== null && _interactionId !== void 0 ? _interactionId : 0;
        this.pushPerformanceAction(this.lastRouteInfo, 'event', {
          interactionId,
          interactionNames: (_attribution$interact2 = attribution.interactionType) !== null && _attribution$interact2 !== void 0 ? _attribution$interact2 : '',
          latency: metric.value,
          elapsedMs: performanceNow(),
          testId,
          tagName,
          componentName,
          pageState: this.getPageState(),
          webVitalsSource: true
        });
        this.debounceFlush();
      } catch (e) {
        captureException(e instanceof Error ? e : new Error(String(e)));
      }
    };
    this.handleCLS = metric => {
      try {
        var _shiftSource$node, _largestShift$startTi, _largestShift$hadRece, _attribution$largestS;
        const {
          attribution
        } = metric;
        const largestShift = attribution.largestShiftEntry;
        const shiftSource = attribution.largestShiftSource;
        const largestShiftNode = (_shiftSource$node = shiftSource === null || shiftSource === void 0 ? void 0 : shiftSource.node) !== null && _shiftSource$node !== void 0 ? _shiftSource$node : null;
        const componentName = getNearestComponentName(largestShiftNode);
        const largestShiftSource = shiftSource ? {
          previousRect: shiftSource.previousRect.toJSON(),
          currentRect: shiftSource.currentRect.toJSON()
        } : undefined;
        let value = metric.value;
        const isEmbedded = isInIframe();
        if (isEmbedded) {
          const iframeArea = window.innerWidth * window.innerHeight;
          const browserArea = window.outerWidth * window.outerHeight;
          if (browserArea > 0 && iframeArea > 0 && iframeArea < browserArea) {
            value = metric.value * (iframeArea / browserArea);
          }
        }
        this.pushPerformanceAction(this.lastRouteInfo, 'layout-shift', {
          entryType: 'layout-shift',
          value,
          isEmbedded,
          startTime: (_largestShift$startTi = largestShift === null || largestShift === void 0 ? void 0 : largestShift.startTime) !== null && _largestShift$startTi !== void 0 ? _largestShift$startTi : 0,
          hadRecentInput: (_largestShift$hadRece = largestShift === null || largestShift === void 0 ? void 0 : largestShift.hadRecentInput) !== null && _largestShift$hadRece !== void 0 ? _largestShift$hadRece : false,
          largestShiftTarget: (_attribution$largestS = attribution.largestShiftTarget) !== null && _attribution$largestS !== void 0 ? _attribution$largestS : '',
          largestShiftSource,
          componentName,
          elapsedMs: performanceNow(),
          pageState: this.getPageState(),
          webVitalsSource: true
        });
        this.debounceFlush();
      } catch (e) {
        captureException(e instanceof Error ? e : new Error(String(e)));
      }
    };
    this.handleFCP = metric => {
      try {
        var _fcpEntry$startTime3;
        const fcpEntry = metric.attribution.fcpEntry;
        this.pushPerformanceAction(this.lastRouteInfo, 'paint', {
          name: 'first-contentful-paint',
          startTime: (_fcpEntry$startTime3 = fcpEntry === null || fcpEntry === void 0 ? void 0 : fcpEntry.startTime) !== null && _fcpEntry$startTime3 !== void 0 ? _fcpEntry$startTime3 : metric.value,
          entryType: 'paint',
          elapsedMs: performanceNow(),
          pageState: this.getPageState(),
          webVitalsSource: true
        });
        this.debounceFlush();
      } catch (e) {
        captureException(e instanceof Error ? e : new Error(String(e)));
      }
    };
    this.handleLoAF = entry => {
      try {
        entry.scripts.forEach(script => {
          if (script.duration >= 50) {
            this.pushPerformanceAction(this.lastRouteInfo, 'longtask', {
              name: script.name,
              entryType: 'longtask',
              startTime: script.startTime,
              duration: script.duration,
              invoker: script.invoker,
              invokerType: script.invokerType,
              pauseDuration: script.pauseDuration,
              executionStart: script.executionStart,
              forcedStyleAndLayoutDuration: script.forcedStyleAndLayoutDuration,
              sourceURL: script.sourceURL,
              sourceFunctionName: script.sourceFunctionName,
              elapsedMs: performanceNow(),
              pageState: this.getPageState(),
              webVitalsSource: true
            });
            this.debounceFlush();
          }
        });
      } catch (e) {
        captureException(e instanceof Error ? e : new Error(String(e)));
      }
    };
    this.stopped = false;
    this.lastStatus = undefined;
    this.lastFailureType = undefined;
    const generateTarget = node => node && 'tagName' in node ? getElementSelector(node) : undefined;
    onLCP(this.handleLCP, {
      generateTarget,
      reportSoftNavs: true
    });
    onINP(this.handleINP, {
      reportAllChanges: true,
      generateTarget
    });
    onCLS(this.handleCLS, {
      reportAllChanges: false,
      generateTarget
    });
    onFCP(this.handleFCP);
    PerformanceEventBus.getInstance().subscribe('long-animation-frame', this.handleLoAF);
    onVisibilityHidden(() => {
      try {
        this.flushPerformanceQueue();
      } catch (e) {
        captureException(e instanceof Error ? e : new Error(String(e)));
      }
    });
  }
  report(action) {
    if (action.type === 'COMPONENT_RENDERED' || this.isResolved(action.payload.entry.id) || this.stopped) {
      return;
    }
    switch (action.type) {
      case 'ROUTE_TIMEOUT_EXPIRED':
        {
          const {
            routeSpec
          } = action.payload;
          if (routeSpec) {
            this.lastRouteInfo = {
              route: routeSpec.route
            };
          }
          this.lastStatus = 'failure';
          this.lastFailureType = 'watchdogExpired';
          break;
        }
      case 'GLOBAL_ERROR':
      case 'ROUTE_FAILED':
        {
          const {
            entry: {
              pathname
            },
            routeSpec
          } = action.payload;
          if (routeSpec) {
            this.lastRouteInfo = {
              pathname,
              route: routeSpec.route
            };
          }
          this.lastStatus = 'failure';
          this.lastFailureType = action.type === 'ROUTE_FAILED' ? 'errorSelector' : undefined;
          break;
        }
      case 'ROUTE_PARTIAL_SUCCESS':
        {
          const {
            entry: {
              pathname
            },
            extra: {
              scenario
            },
            routeSpec
          } = action.payload;
          const {
            route
          } = routeSpec;
          this.lastRouteInfo = {
            pathname,
            route,
            scenario
          };
          this.lastStatus = 'partial_success';
          this.lastFailureType = undefined;
          break;
        }
      case 'ROUTE_SUCCEEDED':
        {
          const {
            entry: {
              pathname
            },
            extra: {
              scenario
            },
            routeSpec
          } = action.payload;
          const {
            route
          } = routeSpec;
          this.lastRouteInfo = {
            pathname,
            route,
            scenario
          };
          this.lastStatus = 'success';
          this.lastFailureType = undefined;
          break;
        }
      default:
    }
    switch (action.type) {
      case 'ROUTE_UNEXPECTED':
        {
          this.stopped = true;
          break;
        }
      case 'GLOBAL_ERROR':
      case 'ROUTE_PARTIAL_SUCCESS':
      case 'ROUTE_SUCCEEDED':
      case 'ROUTE_TIMEOUT_EXPIRED':
      case 'ROUTE_FAILED':
        {
          this.markResolved(action.payload.entry.id);
          break;
        }
      default:
    }
  }
}
WebVitalsAdapter.WINDOW_KEY = '__rhumb_web_vitals_adapter__';