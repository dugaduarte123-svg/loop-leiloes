import { Metrics } from '../metrics/metrics';
export const createEmissionBuffer = ({
  onFlush
}) => {
  let pending = new Map();
  let flushScheduled = false;
  let readyAt = 0;
  const flush = () => {
    const batch = pending;
    pending = new Map();
    flushScheduled = false;
    if (readyAt > 0) {
      Metrics.timer('emissionBuffer.flushDelay').update(performance.now() - readyAt);
      readyAt = 0;
    }
    for (const [instanceKey, state] of batch) {
      onFlush(instanceKey, state);
    }
  };
  return {
    schedule: (instanceKey, state) => {
      pending.set(instanceKey, state);
      if (!flushScheduled) {
        flushScheduled = true;
        queueMicrotask(flush);
      }
    },
    propagationFinished: () => {
      if (flushScheduled) {
        readyAt = performance.now();
      }
    }
  };
};