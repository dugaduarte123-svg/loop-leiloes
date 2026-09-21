import { createDecorator } from '../resolvers/definition/decorator';
import { toError, toLoading, toSuccess } from '../resolvers/definition/resolverState';
export const createPersistenceDecorator = (persistenceManager, {
  maxStoredAge = 0,
  maxFallbackAge = maxStoredAge
}) => createDecorator('persistence', attach => (params, runtime) => {
  var _runtime$getState;
  if (((_runtime$getState = runtime.getState()) === null || _runtime$getState === void 0 ? void 0 : _runtime$getState.data) !== undefined) {
    return attach(params, runtime);
  }
  const instanceKey = runtime.env.instanceKey;

  // SWR
  // If the resolver hasn't yet pushed data and the IDB read resolves with,
  // data that's fresh enough, emit a stale loading state with the IDB's data.
  let resolved = false;
  const idbRead = persistenceManager.read(instanceKey).then(entry => {
    if (!resolved && entry && entry.storedAt + maxStoredAge > Date.now()) {
      runtime.next(toLoading()(toSuccess(JSON.parse(entry.data))()));
    }
    return entry;
  }).catch(err => {
    var _runtime$env$logger;
    (_runtime$env$logger = runtime.env.logger) === null || _runtime$env$logger === void 0 || _runtime$env$logger.error('persistence hydration failed', {
      instanceKey,
      error: err.message
    });
  });

  // Fault tolerance
  // Defer error states until we have a result from IDB.
  // Once we do, publish the deferred state w/ the IDB results if fresh enough.
  let deferredError = null;
  const wrappedNext = (state, meta) => {
    // If a data-ful state is published, the resolver has resolved and we should never
    // publish from IDB.
    if (state.data !== undefined) {
      resolved = true;
    }

    // If the resolver has previously pushed data, or we aren't in an error state,
    // clear the pending error and publish the state.
    if (resolved || !state.error) {
      deferredError = null;
      runtime.next(state, meta);
      return;
    }

    // Always capture the new state, but only fire the IDB read on the first deferral
    const isFirstDeferral = deferredError == null;
    deferredError = {
      state,
      meta
    };
    if (isFirstDeferral) {
      idbRead.then(entry => {
        // If the deferred error was cleared before we got here,
        // don't publish anything.
        if (!deferredError) {
          return;
        }
        const pendingError = deferredError;

        // If the IDB data is fresh enough, publish the error with the cached data.
        if (entry && entry.storedAt + maxFallbackAge > Date.now()) {
          let cachedData;
          try {
            cachedData = JSON.parse(entry.data);
          } catch (err) {
            var _runtime$env$logger2;
            (_runtime$env$logger2 = runtime.env.logger) === null || _runtime$env$logger2 === void 0 || _runtime$env$logger2.error('persistence fallback failed', {
              instanceKey,
              error: err.message
            });
            runtime.next(pendingError.state, pendingError.meta);
            deferredError = null;
            return;
          }
          runtime.next(toError(pendingError.state.error)(toSuccess(cachedData)()), pendingError.meta);
        } else {
          // If the IDB data is stale, publish the deferred error.
          runtime.next(pendingError.state, pendingError.meta);
        }

        // Clear the deferred error so we don't publish it again.
        deferredError = null;
      }).catch(() => {});
    }
  };
  return attach(params, Object.assign({}, runtime, {
    next: wrappedNext,
    // Return the deferred error state if it exists, otherwise return the current state.
    // This lets the resolver read its own writes
    getState: () => {
      var _deferredError$state, _deferredError;
      return (_deferredError$state = (_deferredError = deferredError) === null || _deferredError === void 0 ? void 0 : _deferredError.state) !== null && _deferredError$state !== void 0 ? _deferredError$state : runtime.getState();
    }
  }));
});