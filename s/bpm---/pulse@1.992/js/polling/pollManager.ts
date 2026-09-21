import { createScheduler } from '../scheduler/scheduler';
const createIntervalTracker = () => {
  const intervalCounts = new Map();
  let shortestInterval = null;
  const getShortestInterval = () => shortestInterval;
  return {
    getShortestInterval,
    add: interval => {
      var _intervalCounts$get;
      intervalCounts.set(interval, ((_intervalCounts$get = intervalCounts.get(interval)) !== null && _intervalCounts$get !== void 0 ? _intervalCounts$get : 0) + 1);
      if (!shortestInterval || interval < shortestInterval) {
        shortestInterval = interval;
      }
    },
    remove: interval => {
      const count = intervalCounts.get(interval);
      if (count && count > 1) {
        intervalCounts.set(interval, count - 1);
      } else {
        intervalCounts.delete(interval);

        // Recalculate shortest interval only if we removed the last subscriber
        // with that interval
        if (interval === shortestInterval) {
          shortestInterval = intervalCounts.size > 0 ? Math.min(...intervalCounts.keys()) : null;
        }
      }
    }
  };
};
export const createPollManager = ({
  logger,
  onPoll
}) => {
  const pollScheduler = createScheduler();
  const entityIntervals = new Map();
  const schedulePoll = (instanceKey, interval) => {
    const execute = () => {
      onPoll(instanceKey);
      pollScheduler.queue(instanceKey, interval, execute);
    };
    pollScheduler.queue(instanceKey, interval, execute);
  };
  return {
    getAllStatuses: () => {
      const result = {};
      for (const [instanceKey, tracker] of entityIntervals) {
        var _schedulerStatus$sche, _schedulerStatus$exec;
        const interval = tracker.getShortestInterval();
        const schedulerStatus = pollScheduler.getStatus(instanceKey);
        if (!schedulerStatus || interval == null) {
          continue;
        }
        result[instanceKey] = {
          interval,
          scheduledAt: (_schedulerStatus$sche = schedulerStatus === null || schedulerStatus === void 0 ? void 0 : schedulerStatus.scheduledAt) !== null && _schedulerStatus$sche !== void 0 ? _schedulerStatus$sche : null,
          executeAt: (_schedulerStatus$exec = schedulerStatus === null || schedulerStatus === void 0 ? void 0 : schedulerStatus.executeAt) !== null && _schedulerStatus$exec !== void 0 ? _schedulerStatus$exec : null
        };
      }
      return result;
    },
    register: (instanceKey, interval) => {
      const registerLogger = logger === null || logger === void 0 ? void 0 : logger.withTags({
        instanceKey,
        interval
      });
      if (interval <= 0) {
        registerLogger === null || registerLogger === void 0 || registerLogger.warn('invalid interval, skipping tracking');
        return () => {};
      }
      let tracker = entityIntervals.get(instanceKey);
      if (!tracker) {
        tracker = createIntervalTracker();
        entityIntervals.set(instanceKey, tracker);
      }
      const previousInterval = tracker.getShortestInterval();
      tracker.add(interval);
      if (!previousInterval || interval < previousInterval) {
        registerLogger === null || registerLogger === void 0 || registerLogger.debug('scheduling poll');
        schedulePoll(instanceKey, interval);
      }
      return () => {
        const currentShortestInterval = tracker.getShortestInterval();
        tracker.remove(interval);
        const nextShortestInterval = tracker.getShortestInterval();
        if (nextShortestInterval === null) {
          registerLogger === null || registerLogger === void 0 || registerLogger.debug('no remaining intervals, clearing poll');
          pollScheduler.clear(instanceKey);
          entityIntervals.delete(instanceKey);
        } else if (nextShortestInterval !== currentShortestInterval) {
          const rescheduleLogger = registerLogger === null || registerLogger === void 0 ? void 0 : registerLogger.withTags({
            pollInterval: nextShortestInterval
          });
          rescheduleLogger === null || rescheduleLogger === void 0 || rescheduleLogger.debug('rescheduling poll to next shortest interval');
          schedulePoll(instanceKey, nextShortestInterval);
        }
      };
    }
  };
};