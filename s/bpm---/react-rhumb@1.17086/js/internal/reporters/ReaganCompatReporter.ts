import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["adjustedDurationMs"];
import invariant from 'react-utils/invariant';
import CartographerReporter, { CartographerEndpoint } from './CartographerReporter';
import { DEFAULT_TIMEOUT } from '../Constants';
import { onVisibilityChange, visibilityState, wasHiddenOnScriptStart } from '../visibility';
import { PageLoadMetrics } from '../Metrics';
import { isReload, performanceGetEntriesByType } from '../navigation';
import { getHubHttpData } from '../httpRequestsStats';
import { getJSChunkData, STATIC_DOMAIN_REGEX, CACHE_DURATION_MS } from '../jsChunkStats';
import { getIsAiCopilotEnabled } from '../aiCopilot';
import { getRelativeMarkerTimings } from '../markerUtils';
import { captureMessage, capturePageEvent } from '../ravenUtils';
import { isPrerendering } from '../env';
import { maybeGetReferrerApp } from '../appTransitionHistory';
export default class ReaganCompatReporter extends CartographerReporter {
  constructor(options) {
    super(options);
    this.abandonedTimes = [];
    this.lastAbandonedTimestamp = null;
    this.finished = false;
    this.isAbandoned = false;
    this.prerendering = isPrerendering();
    this.finishedTimestamp = null;
    this.finishedStatus = null;
    this.reportedMarkers = new Set();
    this.currentRoute = null;
    this.initialLoadCompleted = false;
    // These flags measure if the page was hidden within 500ms (user switched to another tab or window)
    // and remained invisible. This is used to filter out false failures when the page was hidden before
    // the user was frustrated, because the tab becomes throttled and loads very slowly.
    this.hiddenEntirelyBeforeRhumbFinished = wasHiddenOnScriptStart && visibilityState() === 'hidden';
    this.hiddenWithin1000ms = visibilityState() === 'hidden';
    this.hiddenWithin500ms = visibilityState() === 'hidden';
    this.setCustomAttribute('currentVisibility', visibilityState());
    this.setCustomAttribute('visibility', visibilityState());
    this.initVisibilityTracking();
    let becameVisibleAgain = false;
    this._destroyComplexVisibilityListener = onVisibilityChange(state => {
      this.setCustomAttribute('currentVisibility', state);
      if (this.hiddenEntirelyBeforeRhumbFinished && state === 'visible') {
        this.hiddenEntirelyBeforeRhumbFinished = false;
      }
      if (state === 'visible') {
        becameVisibleAgain = true;
        this.hiddenWithin1000ms = false;
        this.hiddenWithin500ms = false;
      }
      if (state === 'hidden') {
        this.setCustomAttribute('visibility', 'hidden');
        if (!becameVisibleAgain) {
          const now = performance.now();
          if (now <= 1000) {
            this.hiddenWithin1000ms = true;
          }
          if (now <= 500) {
            this.hiddenWithin500ms = true;
          }
        }
      }
    });
  }
  destroy() {
    super.destroy();
    this._destroyComplexVisibilityListener();
  }
  getCacheStatusData() {
    const cacheStatusData = {};
    this.performanceEntries().forEach(timing => {
      if (timing.name.endsWith('.js')) {
        const fileName = timing.name.replace(STATIC_DOMAIN_REGEX, '');
        cacheStatusData[fileName] = {
          cached: timing.duration <= CACHE_DURATION_MS,
          duration: timing.duration
        };
      }
    });
    return cacheStatusData;
  }
  buildMetricsDimensions(route, isAiCopilotEnabled, extra) {
    var _this$softNavigationC, _this$softNavigationC2;
    return super.buildMetricsDimensions(route, isAiCopilotEnabled, Object.assign({
      isGraniteRemoteTransition: String(!!this.softNavigationContext),
      isGraniteRemoteCached: String((_this$softNavigationC = (_this$softNavigationC2 = this.softNavigationContext) === null || _this$softNavigationC2 === void 0 ? void 0 : _this$softNavigationC2.isRemoteCached) !== null && _this$softNavigationC !== void 0 ? _this$softNavigationC : false)
    }, extra));
  }
  incrementTimeoutCounters(route, isAiCopilotEnabled, referrerApp) {
    const metadata = this.buildMetricsDimensions(route, isAiCopilotEnabled, referrerApp ? {
      referrerApp
    } : undefined);
    if (!this.wasHidden) {
      PageLoadMetrics.counter('timeouts', metadata).increment();
    }
    if (!this.hiddenWithin1000ms) {
      PageLoadMetrics.counter('timeouts_1000ms_visiblity_threshold', metadata).increment();
    }
    if (!this.hiddenWithin500ms) {
      PageLoadMetrics.counter('timeouts_500ms_visiblity_threshold', metadata).increment();
    }
    if (!this.hiddenEntirelyBeforeRhumbFinished) {
      PageLoadMetrics.counter('timeouts_entirely_hidden_filtered_out', metadata).increment();
    }
  }
  reportTimeoutForRaceCondition(route, duration, timestamp, totalTimeFromRouteStart, checks, referrerApp, isAiCopilotEnabled, extraContext) {
    // Log detection of race condition for monitoring
    capturePageEvent('rhumbTimeoutRaceConditionDetected', {
      extra: Object.assign({
        duration,
        totalTimeFromRouteStart,
        totalDuration: duration + totalTimeFromRouteStart,
        timestamp,
        route
      }, extraContext)
    });

    // Increment timeout counters
    this.incrementTimeoutCounters(route, isAiCopilotEnabled, referrerApp);
    this.finish({
      status: 'failure',
      failureType: 'watchdogExpired',
      duration,
      timestamp,
      totalTimeFromRouteStart,
      adjustedDurationMs: this.getAdjustedDurationMs(timestamp, duration + totalTimeFromRouteStart),
      route
    }, checks, referrerApp, totalTimeFromRouteStart);
    this.performanceMark(`mark_all_failure_watchdog_expired`);
    this.finished = true;
  }
  getNumFailedImages() {
    return Array.from(document.getElementsByTagName('img')).reduce((total, ele) => {
      return ele.src && ele.naturalHeight === 0 && ele.naturalWidth === 0 ? total + 1 : total;
    }, 0);
  }
  finish(attrs, checks, referrerApp, routeStartTimestamp) {
    var _performanceGetEntrie, _this$options$isGrani, _this$options$isGrani2, _this$options$isGrani3, _this$options$isGrani4, _softNavCtx$isRemoteC, _this$options$isGrani5, _this$options$isGrani6;
    const hubHttpData = getHubHttpData(attrs.timestamp);
    const avgDurationBeforePreviousRhumbAborts = this.abandonedTimes.reduce((acc, duration) => {
      return acc + duration / this.abandonedTimes.length;
    }, 0);
    const reaganTiming = getRelativeMarkerTimings(checks, routeStartTimestamp);
    const reaganTimingWithPrefix = {};
    Object.keys(reaganTiming).forEach(marker => {
      reaganTimingWithPrefix[`marker_timing_${marker}`] = reaganTiming[marker];
      this.reportedMarkers.add(marker);
    });
    this.setCustomAttribute('numReaganChecksStarted', this.abandonedTimes.length + 1);
    this.setCustomAttribute('numPreviousReaganChecksAborted', this.abandonedTimes.length);
    this.setCustomAttribute('avgDurationBeforePreviousReaganAborts', avgDurationBeforePreviousRhumbAborts);
    this.setCustomAttribute('numPreviousReaganChecksFailed', 0);
    this.setCustomAttribute('numPreviousReaganChecksSuccessful', 0);
    const activationStartMs =
    // @ts-ignore PerformanceEntry.activationStart is only available in Chromium
    ((_performanceGetEntrie = performanceGetEntriesByType('navigation')) === null || _performanceGetEntrie === void 0 || (_performanceGetEntrie = _performanceGetEntrie[0]) === null || _performanceGetEntrie === void 0 ? void 0 : _performanceGetEntrie.activationStart) || 0;
    PageLoadMetrics.counter('rhumb-finished', {
      status: attrs.status,
      isGraniteEnabled: String((_this$options$isGrani = this.options.isGraniteEnabled) !== null && _this$options$isGrani !== void 0 ? _this$options$isGrani : false),
      isGraniteRemoteApp: String((_this$options$isGrani2 = this.options.isGraniteRemoteApp) !== null && _this$options$isGrani2 !== void 0 ? _this$options$isGrani2 : false),
      isGraniteRemoteTransition: String(!!this.softNavigationContext)
    }).increment();
    const softNavCtx = this.softNavigationContext;
    const {
        adjustedDurationMs
      } = attrs,
      attrsToLog = _objectWithoutPropertiesLoose(attrs, _excluded);
    if (adjustedDurationMs < 0) {
      captureMessage(`Navigation duration was negative (${adjustedDurationMs / 1000}s)${this.softNavigationContext ? ' (granite remote transition)' : ''}, skipping Cartographer report`, {
        level: 'warning'
      });
      return;
    }
    const adjustedDuration = adjustedDurationMs / 1000;
    this.finishedTimestamp = attrs.timestamp;
    this.finishedStatus = attrs.status;
    this.currentRoute = attrs.route;
    this.initialLoadCompleted = true;
    const jsChunkData = getJSChunkData(attrs.timestamp);
    capturePageEvent('rhumbFinished', {
      extra: Object.assign({}, attrsToLog, {
        duration: adjustedDuration
      }, hubHttpData, jsChunkData, {
        numChecksStarted: this.abandonedTimes.length + 1,
        numPreviousChecksAborted: this.abandonedTimes.length,
        avgDurationBeforePreviousRhumbAborts,
        numFailedImages: this.getNumFailedImages(),
        allVisibleMarkers: JSON.stringify(Object.keys(checks)),
        wasPrerendered: this.prerendering || activationStartMs > 0,
        wasHiddenOnScriptStart,
        wasEverHidden: this.wasHidden,
        wasHiddenWhenRhumbFinished: visibilityState() === 'hidden',
        hiddenEntirelyBeforeRhumbFinished: this.hiddenEntirelyBeforeRhumbFinished,
        hiddenWithin1000ms: this.hiddenWithin1000ms,
        hiddenWithin500ms: this.hiddenWithin500ms,
        referrerApp,
        isGraniteRemoteTransition: !!softNavCtx,
        isGraniteEnabled: (_this$options$isGrani3 = this.options.isGraniteEnabled) !== null && _this$options$isGrani3 !== void 0 ? _this$options$isGrani3 : false,
        isGraniteRemoteApp: (_this$options$isGrani4 = this.options.isGraniteRemoteApp) !== null && _this$options$isGrani4 !== void 0 ? _this$options$isGrani4 : false
      }, softNavCtx ? {
        fromRemoteApp: softNavCtx.fromRemoteApp
      } : {}, reaganTimingWithPrefix)
    });
    const fromRoute = softNavCtx ? {
      from: {
        pathname: softNavCtx.fromPathname,
        route: softNavCtx.fromRoute
      }
    } : {};
    this.sendActions([Object.assign({
      to: {
        pathname: attrs.pathname,
        route: attrs.route,
        scenario: attrs.scenario
      }
    }, fromRoute, {
      status: attrs.status,
      wasHidden: this.wasHidden,
      isHidden: visibilityState() === 'hidden',
      duration: adjustedDuration,
      failureType: attrs.failureType,
      isReload: softNavCtx ? false : isReload()
    }, softNavCtx ? {
      isGraniteRemoteTransition: true
    } : {}, softNavCtx ? {
      isGraniteRemoteCached: (_softNavCtx$isRemoteC = softNavCtx.isRemoteCached) !== null && _softNavCtx$isRemoteC !== void 0 ? _softNavCtx$isRemoteC : false
    } : {}, {
      isGraniteEnabled: (_this$options$isGrani5 = this.options.isGraniteEnabled) !== null && _this$options$isGrani5 !== void 0 ? _this$options$isGrani5 : false,
      isGraniteRemoteApp: (_this$options$isGrani6 = this.options.isGraniteRemoteApp) !== null && _this$options$isGrani6 !== void 0 ? _this$options$isGrani6 : false,
      timestamp: attrs.timestamp,
      markers: reaganTiming,
      initialUrl: this.initialUrl
    }, referrerApp ? {
      referrerApp
    } : {}, jsChunkData ? {
      numJSChunksLoaded: jsChunkData.numJSChunksLoaded,
      numJSChunksCached: jsChunkData.numJSChunksCached,
      numJSChunksUncached: jsChunkData.numJSChunksUncached
    } : {})], CartographerEndpoint.Navigation);
  }
  getNewMarkers(checks, routeStartTimestamp, maxTimeSinceRouteStart = Infinity) {
    const newMarkers = {};
    Object.keys(checks).forEach(marker => {
      if (checks[marker] && !this.reportedMarkers.has(marker)) {
        const relativeTimestamp = checks[marker].timestamp - routeStartTimestamp;
        if (relativeTimestamp <= maxTimeSinceRouteStart) {
          newMarkers[marker] = relativeTimestamp;
          this.reportedMarkers.add(marker);
        }
      }
    });
    return newMarkers;
  }
  reportLateMarkers(markers, routeSpec, pathname, routeStartTimestamp) {
    if (!this.finishedStatus) {
      captureMessage('[react-rhumb] finishedStatus must be set when reporting late markers', {
        level: 'error',
        extra: {
          route: routeSpec.route,
          pathname,
          markers
        }
      });
      return;
    }
    this.pushNavigationAction({
      to: {
        route: routeSpec.route,
        pathname
      },
      status: this.finishedStatus,
      wasHidden: this.wasHidden,
      isHidden: visibilityState() === 'hidden',
      timestamp: routeStartTimestamp + Math.max(...Object.values(markers)),
      markers,
      isAfterRhumbFinished: true,
      initialUrl: this.initialUrl
    });
    this.flushNavigationQueue();
  }
  report(action) {
    if (action.type === 'COMPONENT_RENDERED' || !this) {
      return;
    }

    // After route finishes, only process CHECKS_CHANGED to detect late markers or ROUTE_STARTED to begin new navigation
    if (this.finished && action.type !== 'CHECKS_CHANGED' && action.type !== 'ROUTE_STARTED') {
      return;
    }
    const referrerApp = maybeGetReferrerApp(this.softNavigationContext);
    const {
      entry: {
        timestamp: totalTimeFromRouteStart = 0,
        checks,
        expiredTimestamp,
        pathname
      },
      routeSpec
    } = action.payload;
    switch (action.type) {
      case 'ROUTE_SUCCEEDED':
      case 'ROUTE_PARTIAL_SUCCESS':
      case 'ROUTE_FAILED':
      case 'ROUTE_TIMEOUT_EXPIRED':
      case 'ROUTE_UNEXPECTED':
        {
          this.finished = true;
          break;
        }
      default:
    }
    const isAiCopilotEnabled = String(getIsAiCopilotEnabled());
    switch (action.type) {
      case 'ROUTE_STARTED':
        {
          if (this.lastAbandonedTimestamp) {
            this.abandonedTimes.push(totalTimeFromRouteStart - this.lastAbandonedTimestamp);
          }
          this.isAbandoned = false;
          if (!this.initialLoadCompleted) {
            this.finished = false;
          } else {
            this.abandonedTimes = [];
            this.lastAbandonedTimestamp = null;
          }
          this.finishedTimestamp = null;
          this.finishedStatus = null;
          this.reportedMarkers.clear();
          this.currentRoute = routeSpec.route;
          break;
        }
      case 'ROUTE_ABANDONED':
        {
          this.lastAbandonedTimestamp = totalTimeFromRouteStart;
          this.isAbandoned = true;
          break;
        }
      case 'ROUTE_PARTIAL_SUCCESS':
        {
          const {
            partialSuccess,
            route
          } = routeSpec;
          const {
            extra: {
              scenario
            }
          } = action.payload;
          const markers = partialSuccess[scenario] || [];
          const {
            duration,
            timestamp,
            selector
          } = this.toTimings(checks, totalTimeFromRouteStart, markers);
          const adjustedDurationMs = this.getAdjustedDurationMs(timestamp, duration + totalTimeFromRouteStart);

          // Validate that success duration is under timeout threshold
          // This catches race conditions where success markers appear after timeout
          // threshold but before the delayed timeout callback fires (e.g., under high CPU load)
          if (adjustedDurationMs > DEFAULT_TIMEOUT) {
            this.reportTimeoutForRaceCondition(route, duration, timestamp, totalTimeFromRouteStart, checks, referrerApp, isAiCopilotEnabled, {
              scenario,
              selector,
              pathname,
              detectedInPartialSuccess: true
            });
            break;
          }
          if (!this.wasHidden) {
            PageLoadMetrics.timer('partial_success', this.buildMetricsDimensions(route, isAiCopilotEnabled, Object.assign({
              scenario
            }, referrerApp ? {
              referrerApp
            } : {}))).update(adjustedDurationMs);
          }
          this.finish({
            status: 'partial_success',
            duration,
            timestamp,
            totalTimeFromRouteStart,
            adjustedDurationMs,
            pathname,
            scenario,
            selector,
            route
          }, checks, referrerApp, totalTimeFromRouteStart);
          this.performanceMark(`mark_all_success`);
          break;
        }
      case 'ROUTE_SUCCEEDED':
        {
          var _performanceGetEntrie2;
          const {
            success,
            route
          } = routeSpec;
          const {
            extra: {
              scenario
            }
          } = action.payload;
          if (process.env.NODE_ENV !== 'production') {
            invariant(success[scenario].length > 0, 'routeSpec for %s must have at least one `success` marker for %s', route, scenario);
          }
          const markers = success[scenario] || [];
          const {
            duration,
            timestamp,
            selector
          } = this.toTimings(checks, totalTimeFromRouteStart, markers);
          const adjustedDurationMs = this.getAdjustedDurationMs(timestamp, duration + totalTimeFromRouteStart);

          // Validate that success duration is under timeout threshold
          // This catches race conditions where success markers appear after timeout
          // threshold but before the delayed timeout callback fires (e.g., under high CPU load)
          if (adjustedDurationMs > DEFAULT_TIMEOUT) {
            this.reportTimeoutForRaceCondition(route, duration, timestamp, totalTimeFromRouteStart, checks, referrerApp, isAiCopilotEnabled, {
              scenario,
              selector,
              pathname,
              detectedInPartialSuccess: false
            });
            break;
          }
          if (!this.wasHidden) {
            PageLoadMetrics.timer('succeeded', this.buildMetricsDimensions(route, isAiCopilotEnabled, Object.assign({
              scenario
            }, referrerApp ? {
              referrerApp
            } : {}))).update(adjustedDurationMs);
          }
          const activationStartMs =
          // @ts-ignore PerformanceEntry.activationStart is only available in Chromium
          ((_performanceGetEntrie2 = performanceGetEntriesByType('navigation')) === null || _performanceGetEntrie2 === void 0 || (_performanceGetEntrie2 = _performanceGetEntrie2[0]) === null || _performanceGetEntrie2 === void 0 ? void 0 : _performanceGetEntrie2.activationStart) || 0;
          if (activationStartMs > 0) {
            PageLoadMetrics.timer('succeeded-prerender', this.buildMetricsDimensions(route, isAiCopilotEnabled, Object.assign({
              scenario
            }, referrerApp ? {
              referrerApp
            } : {}))).update(totalTimeFromRouteStart + duration - activationStartMs);
          }
          this.finish({
            status: 'success',
            duration,
            timestamp,
            totalTimeFromRouteStart,
            adjustedDurationMs,
            pathname,
            scenario,
            selector,
            route
          }, checks, referrerApp, totalTimeFromRouteStart);
          this.performanceMark(`mark_all_success`);
          break;
        }
      case 'ROUTE_FAILED':
        {
          // Avoid reporting 'ROUTE_FAILED' after 'ROUTE_ABANDONED' in case there is a race condition where failure markers
          // are still visible in the DOM after navigation away has started. E.g., hub-http can automatically redirect to
          // the login screen on 401s, and this should not be counted as a failure state even if the app briefly shows an error
          // before the redirect completes.
          if (this.isAbandoned) {
            break;
          }
          const {
            route,
            error
          } = routeSpec;
          const markers = error.filter(marker => checks[marker]);
          if (process.env.NODE_ENV !== 'production') {
            invariant(markers.length > 0, 'routeSpec for %s must have at least one `failure` marker for', route);
          }
          const {
            duration,
            timestamp,
            selector
          } = this.toTimings(checks, totalTimeFromRouteStart, markers);
          const failedMarker = markers.length ? markers[0] : '';
          if (!this.wasHidden) {
            PageLoadMetrics.counter('failed', this.buildMetricsDimensions(route, isAiCopilotEnabled, Object.assign({
              selector: failedMarker
            }, referrerApp ? {
              referrerApp
            } : {}))).increment();
          }
          this.finish({
            status: 'failure',
            failureType: 'errorSelector',
            selector,
            duration,
            timestamp,
            totalTimeFromRouteStart,
            adjustedDurationMs: this.getAdjustedDurationMs(timestamp, duration + totalTimeFromRouteStart),
            route,
            pathname
          }, checks, referrerApp, totalTimeFromRouteStart);
          this.performanceMark(`mark_all_failure`);
          break;
        }
      case 'ROUTE_TIMEOUT_EXPIRED':
        {
          const {
            route
          } = routeSpec;
          this.incrementTimeoutCounters(route, isAiCopilotEnabled, referrerApp);
          const expiredTs = expiredTimestamp || performance.now();
          const timeoutDuration = Math.max(0, expiredTs - totalTimeFromRouteStart);
          this.finish({
            status: 'failure',
            failureType: 'watchdogExpired',
            duration: timeoutDuration,
            timestamp: expiredTs,
            totalTimeFromRouteStart,
            adjustedDurationMs: this.computeTimeoutDurationMs(expiredTs, totalTimeFromRouteStart),
            route
          }, checks, referrerApp, totalTimeFromRouteStart);
          this.performanceMark(`mark_all_failure_watchdog_expired`);
          break;
        }
      case 'CHECKS_CHANGED':
        {
          // Only report late markers for the same route that finished and within 60s of route start
          if (this.finished && this.finishedTimestamp && routeSpec.route === this.currentRoute) {
            const newMarkers = this.getNewMarkers(checks, totalTimeFromRouteStart, 60000);
            if (Object.keys(newMarkers).length > 0) {
              this.reportLateMarkers(newMarkers, routeSpec, pathname, totalTimeFromRouteStart);
            }
          }
          break;
        }
      default:
    }
  }
}