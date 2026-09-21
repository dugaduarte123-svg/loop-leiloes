import { Metrics } from './metrics';
const RHUMB_MARKS = ['mark_all_success', 'mark_all_failure'];
let flushed = false;
let observerSetup = false;
let aggregates = {
  total: 0,
  attach: 0,
  detach: 0,
  stateChange: 0,
  invalidate: 0,
  gc: 0,
  resync: 0,
  materialize: 0
};
const flush = () => {
  if (flushed) return;
  flushed = true;
  for (const key of Object.keys(aggregates)) {
    if (aggregates[key] > 0) {
      Metrics.timer(`rhumb.${key}`).update(aggregates[key]);
    }
  }
};
const setupObserver = () => {
  if (observerSetup) return;
  observerSetup = true;
  if (typeof window === 'undefined' || !window.PerformanceObserver) return;
  if (RHUMB_MARKS.some(mark => performance.getEntriesByName(mark, 'mark').length > 0)) {
    // Rhumb already fired before Pulse started accumulating (e.g. lazy bundle
    // loaded after initial navigation). Emit whatever's accumulated so far so
    // the metric isn't silently dropped.
    flush();
    return;
  }

  // eslint-disable-next-line compat/compat
  const observer = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'mark' && RHUMB_MARKS.includes(entry.name)) {
        flush();
        observer.disconnect();
        break;
      }
    }
  });
  observer.observe({
    entryTypes: ['mark']
  });
};
export const rhumbAggregator = {
  accumulate(bucket, duration) {
    if (flushed) return;
    aggregates[bucket] += duration;
    aggregates.total += duration;
    if (!observerSetup) setupObserver();
  }
};
export const __test_only_resetRhumbAggregator = () => {
  flushed = false;
  observerSetup = false;
  aggregates = {
    total: 0,
    attach: 0,
    detach: 0,
    stateChange: 0,
    invalidate: 0,
    gc: 0,
    resync: 0,
    materialize: 0
  };
};