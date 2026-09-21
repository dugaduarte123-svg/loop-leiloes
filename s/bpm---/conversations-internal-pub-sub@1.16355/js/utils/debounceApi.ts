export const DEBOUNCED = 'DEBOUNCED';

/**
 * Debounce calls to an API. When an call is in progress, calls are queued.  When the call completes,
 * the most recent call is invoked and all queued calls receive the result.
 *
 * If a call is debounced it will resolve with wrappedFunction.DEBOUNCED as a value
 *
 * @example
 *   const wrapped = debounceApi(myApi);
 *
 *   myApi().then(result => {
 *     if (result === myApi.DEBOUNCED) return; // This call was debounced
 *     doSomethingWith(result);
 *   });
 */
export const debounceApi = func => {
  let previousCall = Promise.resolve(DEBOUNCED);
  let nextArgs = null;
  const maybeCallWithMostRecentArgs = () => new Promise((resolve, reject) => {
    if (!nextArgs) {
      resolve(DEBOUNCED);
    } else {
      func(...nextArgs).then(result => resolve(result)).catch(reject);
      nextArgs = null;
    }
  });
  const wrapped = (...args) => {
    nextArgs = args;
    previousCall = previousCall.then(maybeCallWithMostRecentArgs).catch(maybeCallWithMostRecentArgs);
    return previousCall;
  };
  wrapped.DEBOUNCED = DEBOUNCED;
  return wrapped;
};