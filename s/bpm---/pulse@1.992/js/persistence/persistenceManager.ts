import { createPersistenceWriter } from './write';
import { readFromIDB, openDB, CACHE_STORE } from './connection';
import { getSegment } from './segment';
const STALE_DATA_REMOVAL_CUTOFF = 1000 * 60 * 60 * 24 * 10; // 10 days
const CLEANUP_DELAY = 10000; // 10s

let __disabled = false;
export const __testOnlyDisablePersistence = () => {
  __disabled = true;
};
export const __testOnlyEnablePersistence = () => {
  __disabled = false;
};
const deleteStaleEntries = connection => connection.then(db => new Promise((resolve, reject) => {
  try {
    const tx = db.transaction(CACHE_STORE, 'readwrite');
    const cutoff = Date.now() - STALE_DATA_REMOVAL_CUTOFF;
    const range = IDBKeyRange.upperBound(cutoff);
    const request = tx.objectStore(CACHE_STORE).index('storedAt').openCursor(range);
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      } else {
        resolve();
      }
    };
    request.onerror = reject;
  } catch (e) {
    reject(e);
  }
}));
export const createPersistenceManager = () => {
  if (__disabled) {
    return null;
  }
  const segment = getSegment();
  if (!segment) {
    return null;
  }
  const pendingKeys = new Set();
  let isAvailable = true;
  const disable = () => {
    isAvailable = false;
    pendingKeys.clear();
  };
  const connection = openDB(segment).catch(error => {
    disable();
    throw error;
  });
  void connection.catch(() => {});
  const writer = createPersistenceWriter(connection);
  setTimeout(() => {
    if (isAvailable) {
      deleteStaleEntries(connection).catch(disable);
    }
  }, CLEANUP_DELAY);
  return {
    write: (instanceKey, state) => {
      if (isAvailable && !state.loading && !state.error && state.data !== undefined) {
        pendingKeys.add(instanceKey);
        void writer.write(instanceKey, state.data).catch(disable).finally(() => {
          pendingKeys.delete(instanceKey);
        });
      }
    },
    read: instanceKey => isAvailable ? readFromIDB(instanceKey, connection).catch(() => null) : Promise.resolve(null),
    getAllStatuses: () => ({
      pending: [...pendingKeys]
    }),
    segment
  };
};