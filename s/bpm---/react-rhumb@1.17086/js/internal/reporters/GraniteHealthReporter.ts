import BaseReporter from './BaseReporter';
import { accumulateDelta, getAllDeltas, getCounts, getPreviousSnapshot, hasThresholdFired, incrementTransitionCount, installGraniteHealthPatches, markThresholdFired, saveSnapshot } from '../GraniteHealthPatches';
import { GraniteHealthMetrics } from '../Metrics';
import { maybeGetReferrerApp } from '../appTransitionHistory';
import { capturePageEvent } from '../ravenUtils';
export default class GraniteHealthReporter extends BaseReporter {
  constructor(options) {
    var _options$thresholds;
    super(options);
    this.fired = false;
    this.thresholds = (_options$thresholds = options === null || options === void 0 ? void 0 : options.thresholds) !== null && _options$thresholds !== void 0 ? _options$thresholds : {};
    installGraniteHealthPatches();
  }
  report(action) {
    if (this.fired || action.type !== 'ROUTE_SUCCEEDED') {
      return;
    }
    this.fired = true;

    // Track health counts on every ROUTE_SUCCEEDED — including non-Granite initial
    // loads — so the baseline snapshot is available for accurate delta attribution
    // on subsequent Granite transitions.
    const {
      listenerCount,
      timerCount,
      observerCount
    } = getCounts();
    const currentCounts = {
      listenerCount,
      timerCount,
      observerCount
    };
    const previousSnapshot = getPreviousSnapshot();
    if (previousSnapshot !== null) {
      const delta = {
        listenerCount: listenerCount - previousSnapshot.listenerCount,
        timerCount: timerCount - previousSnapshot.timerCount,
        observerCount: observerCount - previousSnapshot.observerCount
      };
      accumulateDelta(this.staticAppName, delta);
    }
    saveSnapshot(currentCounts);
    const softNavCtx = this.softNavigationContext;
    if (!softNavCtx) {
      return;
    }
    incrementTransitionCount();
    const {
      transitionCount
    } = getCounts();
    const referrerApp = maybeGetReferrerApp(softNavCtx);
    const dimensions = Object.assign({
      transition: String(Math.min(transitionCount, 20))
    }, referrerApp !== null && {
      referrerApp
    });
    GraniteHealthMetrics.histogram('stylesheet-count', dimensions).update(document.styleSheets.length);
    GraniteHealthMetrics.histogram('listener-count', dimensions).update(listenerCount);
    GraniteHealthMetrics.histogram('timer-count', dimensions).update(timerCount);
    GraniteHealthMetrics.histogram('observer-count', dimensions).update(observerCount);
    this.maybeFireThresholdEvent(currentCounts, transitionCount);
  }
  maybeFireThresholdEvent(currentCounts, transitionCount) {
    if (hasThresholdFired()) {
      return;
    }
    const exceeded = this.findExceededThreshold(currentCounts);
    if (!exceeded) {
      return;
    }
    markThresholdFired();
    const appDeltas = getAllDeltas();
    const likelyLeaker = this.findLikelyLeaker(appDeltas, exceeded.metric);
    capturePageEvent('granite-health-threshold-exceeded', {
      extra: {
        triggeredBy: exceeded.metric,
        currentValue: exceeded.value,
        threshold: exceeded.threshold,
        currentCounts,
        transitionCount,
        appDeltas,
        likelyLeaker
      }
    });
  }
  findLikelyLeaker(appDeltas, metric) {
    // Skip the last entry — it's the most recently loaded app, which hasn't had
    // a chance to clean up yet. All prior entries are valid candidates.
    let maxDelta = 0;
    let likelyLeaker = null;
    for (const entry of appDeltas.slice(0, -1)) {
      var _entry$metric;
      const value = (_entry$metric = entry[metric]) !== null && _entry$metric !== void 0 ? _entry$metric : 0;
      if (value > maxDelta) {
        maxDelta = value;
        likelyLeaker = entry.appName;
      }
    }
    return likelyLeaker;
  }
  findExceededThreshold(counts) {
    const checks = [['listenerCount', counts.listenerCount], ['timerCount', counts.timerCount], ['observerCount', counts.observerCount]];
    for (const [metric, value] of checks) {
      const threshold = this.thresholds[metric];
      if (threshold !== undefined && value >= threshold) {
        return {
          metric,
          value,
          threshold
        };
      }
    }
    return null;
  }
}