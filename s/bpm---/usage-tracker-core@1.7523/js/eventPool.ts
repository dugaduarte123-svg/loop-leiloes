import { createQueue, dispatchFunctionAsync } from './common/helpers';
import { createSafeGuard } from './safeGuard';
export const createEventPool = ({
  getTempStorage,
  setTempStorage
}) => {
  const eventQueue = createQueue();
  const safeGuard = createSafeGuard({
    getTempStorage,
    setTempStorage
  });
  return {
    peek: eventQueue.peek,
    push: event => {
      eventQueue.enqueue(event);

      // This method attempts to save the Event to a safe-guard storage in case
      // that Events are not dispatched by any of the other safe-guard methods
      dispatchFunctionAsync(() => safeGuard.addEvents([event]));
    },
    flush: () => {
      const events = [];
      do {
        const event = eventQueue.dequeue();
        if (event) {
          events.unshift(event);
        }
      } while (eventQueue.peek());

      // Remove from the SafeGuard storage Events that were dispatched successfully
      dispatchFunctionAsync(() => safeGuard.removeEvents(events));
      return events;
    }
  };
};