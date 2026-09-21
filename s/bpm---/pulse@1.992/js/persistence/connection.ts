export const CACHE_STORE = 'cache';
export const openDB = segment => segment.then(seg => new Promise((resolve, reject) => {
  try {
    const request = window.indexedDB.open(`pulse/${seg}`, 1);
    request.onerror = reject;
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CACHE_STORE)) {
        const store = db.createObjectStore(CACHE_STORE);
        store.createIndex('storedAt', 'storedAt', {
          unique: false
        });
        store.createIndex('typeName', 'typeName', {
          unique: false
        });
      }
    };
    request.onsuccess = () => {
      request.result.onerror = console.error;
      resolve(request.result);
    };
  } catch (e) {
    reject(e);
  }
}));
export const readFromIDB = (key, connection) => connection.then(db => new Promise((resolve, reject) => {
  try {
    const request = db.transaction(CACHE_STORE, 'readonly').objectStore(CACHE_STORE).get(key);
    request.onerror = reject;
    request.onsuccess = () => request.result != null ? resolve(request.result) : reject(Error('Entry not found'));
  } catch (e) {
    reject(e);
  }
}));