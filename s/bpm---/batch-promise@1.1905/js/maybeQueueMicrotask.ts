export const maybeQueueMicrotask = fn => {
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(fn);
  } else {
    // Slightly different from the native implementation, but
    // good enough for a fallback
    Promise.resolve().then(fn).catch(err => setTimeout(() => {
      throw err;
    }));
  }
};