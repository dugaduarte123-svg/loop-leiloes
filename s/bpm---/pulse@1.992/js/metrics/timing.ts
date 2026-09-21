import { Metrics } from './metrics';
import { rhumbAggregator } from './rhumbAggregator';
let depth = 0;
function timed(bucket, fn, operationTimer) {
  depth++;
  const startTime = performance.now();
  try {
    return fn();
  } finally {
    const duration = performance.now() - startTime;
    depth--;
    if (operationTimer) {
      Metrics.timer(operationTimer).update(duration);
    }
    if (depth === 0) {
      Metrics.timer('cpuTime').update(duration);
    }
    rhumbAggregator.accumulate(bucket, duration);
  }
}
export const timing = {
  timeAttach(fn) {
    return timed('attach', fn);
  },
  timeDetach(fn) {
    return timed('detach', fn);
  },
  timeStateChange(fn) {
    return timed('stateChange', fn, 'lifecycleManager.handleStateChange');
  },
  timeInvalidate(fn) {
    return timed('invalidate', fn, 'lifecycleManager.invalidate');
  },
  timeInvalidateAll(fn) {
    return timed('invalidate', fn, 'lifecycleManager.invalidateAll');
  },
  timeCollectNode(fn) {
    return timed('gc', fn);
  },
  timeResync(fn) {
    return timed('resync', fn, 'lifecycleManager.resync');
  },
  timeMaterialize(fn) {
    return timed('materialize', fn, 'lifecycleManager.materialize');
  }
};