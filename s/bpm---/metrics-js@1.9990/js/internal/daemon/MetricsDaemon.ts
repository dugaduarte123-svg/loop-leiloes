"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MetricsDaemon = void 0;
exports.resetCachedMetricsDaemonForTesting = resetCachedMetricsDaemonForTesting;
var _stableStringify = require("../stableStringify");
var _time = require("../time");
var _metricsApi = require("../metricsApi");
var _getGlobal = require("../getGlobal");
let instance = null;
const DISABLE_FLAG = '__metricsJsDisabled';
function resetCachedMetricsDaemonForTesting() {
  if (instance) {
    instance.stop();
    instance = null;
  }
}

// Borrowed from Google's `idlize`
// https://github.com/GoogleChromeLabs/idlize/blob/836cbc2c975749e259e94589e3d064c835836d1a/IdleQueue.mjs#L24
const isSafari = () => !!(typeof window.safari === 'object' && window.safari.pushNotification);
class MetricsDaemon {
  /** prevent external instantiation */
  constructor() {
    this.metrics = new Map();
    this.interval = undefined;
    this.flush = (endOfSession = false) => {
      const datapointsToSend = [];
      const Raven = window.Raven;
      this.metrics.forEach(metric => {
        try {
          const metricCanFlush = metric.canFlush(endOfSession);
          const metricReport = metric.flush();
          if (metricCanFlush && !this.isMetricCyclic(metricReport)) {
            datapointsToSend.push(metricReport);
          }
        } catch (error) {
          const errorMessage = `Failed to flush metric: ${metric.getName()}. Metric data has been dropped to prevent memory issues.`;
          console.error(`[metrics-js] ${errorMessage}`, error);
          if (Raven) {
            Raven.captureException(error, {
              extra: {
                metricName: metric.getName(),
                metricDimensions: metric.getDimensions(),
                message: errorMessage
              }
            });
          }
        }
      });
      if (datapointsToSend.length > 0) {
        (0, _metricsApi.send)(datapointsToSend);
      }
    };
    this.eagerlyFlushQueueOnUnload = () => {
      if (document.visibilityState === 'hidden' || this.listenTo === 'beforeunload') {
        this.stop();
      }
    };
    // the most correct way to listen for the page unloading is the
    // visibilitychange event, except for a couple cases where it's buggy
    // in Safari
    // https://philipwalton.com/articles/idle-until-urgent/
    this.listenTo = isSafari() ? 'beforeunload' : 'visibilitychange';
  }
  static instance() {
    instance = instance || new MetricsDaemon();
    return instance;
  }
  clearMetricCache() {
    this.metrics.clear();
  }

  /**
   * `run` is idempotent and may be called repeatedly without side effects.
   */
  run() {
    if ((0, _getGlobal.getGlobal)() && (0, _getGlobal.getGlobal)().hubspot && (0, _getGlobal.getGlobal)().hubspot[DISABLE_FLAG]) {
      return;
    }
    if (!this.interval) {
      this.interval = setInterval(this.flush, _time.ONE_MINUTE);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore sometimes metrics-js is pulled into a node context, don't want to keep the node process alive
      // check for presence of interval since setInterval calls may return undefined if setInterval method was monkey patched
      if (this.interval && this.interval.unref) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore sometimes metrics-js is pulled into a node context, don't want to keep the node process alive
        this.interval.unref();
      }
      try {
        window.addEventListener(this.listenTo, this.eagerlyFlushQueueOnUnload, true);
      } catch (__err) {
        // ignore, this is an unrecoverable failure
      }
    }
  }
  stop() {
    clearInterval(this.interval);
    this.interval = undefined;
    this.flush(true);
    this.clearMetricCache();
    try {
      window.removeEventListener(this.listenTo, this.eagerlyFlushQueueOnUnload);
    } catch (__err) {
      // ignore, this is an unrecoverable failure
    }
  }
  getMetricCacheKey(name, dimensions) {
    return `${name}-${(0, _stableStringify.stableStringify)(dimensions)}`;
  }
  isMetricCyclic(metric) {
    const keys = [];
    const stack = [];
    const stackSet = new Set();
    let detected = false;
    const Raven = window.Raven;
    function detect(obj, key) {
      if (!obj || obj && typeof obj !== 'object') {
        return;
      }
      if (stackSet.has(obj)) {
        detected = true;
        return;
      }
      keys.push(key);
      stack.push(obj);
      stackSet.add(obj);
      Object.keys(obj).forEach(childKey => {
        // dive on the object's children
        if (Object.prototype.hasOwnProperty.call(obj, childKey)) {
          detect(obj[childKey], childKey);
        }
      });
      keys.pop();
      stack.pop();
      stackSet.delete(obj);
      return;
    }
    detect(metric, 'metric');
    if (detected && Raven) {
      const errorMessage = `Identified circular reference in datapoint: ${metric.name}. datapoint not reported`;
      console.error(errorMessage);
      Raven.captureException(new Error(errorMessage));
    }
    return detected;
  }
  getMetric(name, dimensions, MetricCtor) {
    const cacheKey = this.getMetricCacheKey(name, dimensions);
    if (this.metrics.has(cacheKey)) {
      return this.metrics.get(cacheKey);
    }
    const newMetric = new MetricCtor(name, dimensions);
    this.metrics.set(cacheKey, newMetric);
    return newMetric;
  }
}
exports.MetricsDaemon = MetricsDaemon;