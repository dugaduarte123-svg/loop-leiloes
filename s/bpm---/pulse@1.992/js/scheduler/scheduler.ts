import { clamp } from '../utils/clamp';
export const createScheduler = ({
  minPeriod,
  maxPeriod
} = {}) => {
  const schedulerQueue = new Map();
  const clear = instanceKey => {
    const entry = schedulerQueue.get(instanceKey);
    if (entry) {
      clearTimeout(entry.timeoutId);
      schedulerQueue.delete(instanceKey);
      return true;
    }
    return false;
  };
  return {
    clear,
    queue: (id, period, callback) => {
      clear(id);
      const clampedPeriod = clamp(period, minPeriod !== null && minPeriod !== void 0 ? minPeriod : period, maxPeriod !== null && maxPeriod !== void 0 ? maxPeriod : period);
      const now = Date.now();
      schedulerQueue.set(id, {
        timeoutId: setTimeout(() => {
          schedulerQueue.delete(id);
          callback(id);
        }, clampedPeriod),
        scheduledAt: now,
        executeAt: now + clampedPeriod
      });
    },
    getStatus: id => {
      const entry = schedulerQueue.get(id);
      if (!entry) {
        return null;
      }
      return {
        scheduledAt: entry.scheduledAt,
        executeAt: entry.executeAt
      };
    },
    getAllStatuses: () => {
      const result = {};
      for (const [id, entry] of schedulerQueue) {
        result[id] = {
          scheduledAt: entry.scheduledAt,
          executeAt: entry.executeAt
        };
      }
      return result;
    }
  };
};