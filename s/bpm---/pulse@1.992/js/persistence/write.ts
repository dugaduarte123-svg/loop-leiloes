import { batchScheduler } from 'batch-promise';
import { CACHE_STORE } from './connection';
import { parseTypeName } from '../resources/resource';
import { Metrics } from '../metrics/metrics';
export const createPersistenceWriter = connection => {
  const scheduler = batchScheduler().write().identity(({
    key
  }) => key).partition(() => CACHE_STORE).execute(async calls => {
    const list = Object.values(calls);
    const db = await connection;
    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(CACHE_STORE, 'readwrite');
        const store = tx.objectStore(CACHE_STORE);
        for (const {
          key,
          data
        } of list) {
          const stringifyStart = performance.now();
          const serialized = JSON.stringify(data);
          Metrics.timer('persistence.stringify').update(performance.now() - stringifyStart);
          store.put({
            data: serialized,
            storedAt: Date.now(),
            typeName: parseTypeName(key)
          }, key);
        }
        const writeStart = performance.now();
        tx.oncomplete = () => {
          Metrics.timer('persistence.idbWrite').update(performance.now() - writeStart);
          resolve();
        };
        tx.onerror = reject;
        tx.onabort = () => {
          var _tx$error;
          return reject((_tx$error = tx.error) !== null && _tx$error !== void 0 ? _tx$error : Error('Transaction aborted'));
        };
      } catch (e) {
        reject(e);
      }
    });
  }).extract(() => undefined).debounce(3000, 10000);
  try {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        void scheduler.flush();
      }
    });
    document.addEventListener('pagehide', () => {
      void scheduler.flush();
    });
  } catch (_unused) {
    // SSR / test environment without document
  }
  return {
    write: (key, data) => scheduler.queue({
      key,
      data
    }),
    flush: () => scheduler.flush()
  };
};