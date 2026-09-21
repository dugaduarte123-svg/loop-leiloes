import { safeGuardKey } from './storageKeys';
export const createSafeGuard = ({
  getTempStorage,
  setTempStorage
}) => {
  // Note: The safe storage is a best-effort and is prone to async call issues
  // since it might being called by different trackers at multiple different times
  // and it's not guaranteed the same storage is being used (sessionStorage vs localStorage)
  const addEvents = eventsToAdd => {
    try {
      const eventsRaw = getTempStorage(safeGuardKey) || '[]';

      // Always ensures the currentEvents has 50 items or less
      // and that if it has more, the older entries get removed
      const events = JSON.parse(eventsRaw).reverse().slice(0, 49).reverse();
      setTempStorage(safeGuardKey, JSON.stringify(events.concat(eventsToAdd)));
    } catch (err) {
      // In case the storage is corrupt, simply add the current Events
      setTempStorage(safeGuardKey, JSON.stringify(eventsToAdd));
    }
  };

  // Remove Events from the safe storage when they were flushed from the pool successfully
  // Note that the Events might be added back to the safe guard storage if Network errors happen
  const removeEvents = eventsToRemove => {
    try {
      const eventsRaw = getTempStorage(safeGuardKey) || '[]';
      const events = JSON.parse(eventsRaw);
      const filteredEvents = events.filter(event => JSON.stringify(eventsToRemove).indexOf(JSON.stringify(event)) === -1);
      setTempStorage(safeGuardKey, JSON.stringify(filteredEvents));
    } catch (err) {
      // In case the storage is corrupt, simply remove all Events
      setTempStorage(safeGuardKey, '[]');
    }
  };
  const getEvents = () => {
    try {
      const eventsRaw = getTempStorage(safeGuardKey) || '[]';
      return JSON.parse(eventsRaw);
    } catch (err) {
      // In case the storage is corrupt, simply remove all Events
      setTempStorage(safeGuardKey, '[]');
    }
    return [];
  };
  return {
    addEvents,
    getEvents,
    removeEvents
  };
};