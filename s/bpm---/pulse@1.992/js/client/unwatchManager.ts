const TICK_MS = 500;
export const createUnwatchManager = onUnwatch => {
  let collecting = new Set();
  let pendingUnwatch = new Set();
  let intervalId = null;
  const tick = () => {
    for (const instanceKey of pendingUnwatch) {
      onUnwatch(instanceKey);
    }
    pendingUnwatch = collecting;
    collecting = new Set();
    if (pendingUnwatch.size === 0) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
  return {
    queue: instanceKey => {
      collecting.add(instanceKey);
      if (intervalId === null) {
        intervalId = setInterval(tick, TICK_MS);
      }
    },
    clear: instanceKey => {
      collecting.delete(instanceKey);
      pendingUnwatch.delete(instanceKey);
    }
  };
};