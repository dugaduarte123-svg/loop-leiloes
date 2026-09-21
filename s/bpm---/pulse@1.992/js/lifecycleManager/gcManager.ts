import { clamp } from '../utils/clamp';
import { timing } from '../metrics/timing';
const MIN_PERIOD = 15000; // 15s
const MAX_PERIOD = 300000; // 5min
const SWEEP_INTERVAL = 30000; // 30s

let __TEST_ONLY_DISABLE_CACHE_GC = false;
export const __testOnlyDisableCacheGC = () => {
  __TEST_ONLY_DISABLE_CACHE_GC = true;
};
export const __testOnlyEnableCacheGC = () => {
  __TEST_ONLY_DISABLE_CACHE_GC = false;
};
export const createGCManager = ({
  nodes,
  removeNode,
  logger
}) => {
  const pending = new Map();
  let sweepTimer = null;
  const sweep = () => {
    const now = Date.now();
    for (const [instanceKey, entry] of pending) {
      if (entry.eligibleAt > now) {
        continue;
      }
      pending.delete(instanceKey);
      if (!nodes.has(instanceKey)) {
        continue;
      }
      timing.timeCollectNode(() => {
        logger === null || logger === void 0 || logger.debug('collecting node', {
          instanceKey
        });
        removeNode(instanceKey);
      });
    }
    if (pending.size === 0 && sweepTimer !== null) {
      clearInterval(sweepTimer);
      sweepTimer = null;
    }
  };
  const ensureSweeping = () => {
    if (sweepTimer === null) {
      sweepTimer = setInterval(sweep, SWEEP_INTERVAL);
    }
  };
  return {
    queue: (instanceKey, period) => {
      if (__TEST_ONLY_DISABLE_CACHE_GC) {
        return;
      }
      const now = Date.now();
      const clampedPeriod = clamp(period, MIN_PERIOD, MAX_PERIOD);
      pending.set(instanceKey, {
        scheduledAt: now,
        eligibleAt: now + clampedPeriod
      });
      ensureSweeping();
    },
    clear: instanceKey => {
      pending.delete(instanceKey);
      if (pending.size === 0 && sweepTimer !== null) {
        clearInterval(sweepTimer);
        sweepTimer = null;
      }
    },
    getAllStatuses: () => {
      const result = {};
      for (const [id, entry] of pending) {
        result[id] = {
          scheduledAt: entry.scheduledAt,
          executeAt: entry.eligibleAt
        };
      }
      return result;
    }
  };
};