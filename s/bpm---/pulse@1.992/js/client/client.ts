import { createResolverRegistry } from '../resolvers/registry/resolverRegistry';
import { createResourceLifecycleManager } from '../lifecycleManager/resourceLifecycleManager';
import { create } from 'event-emitter';
import { defaultResourceRegistry } from '../resources/resourceRegistry';
import { createChangeManager } from './changeManager';
import { createPollManager } from '../polling/pollManager';
import { createUnwatchManager } from './unwatchManager';
import { createGroupManager } from '../groups/groupManager';
import { createEmissionBuffer } from './emissionBuffer';
import { indexedMap } from '../utils/indexedMap';
import { withTrackedResolvers } from '../utils/withResolvers';
import { createLogger } from '../devtools/logger';
import { maybeLoadDevtools } from '../devtools/maybeLoadDevtools';
import { processStack } from '../devtools/processStack';
import { __mockInternal_isEnabled, __mockInternal_getMockResolver, __mockInternal_registerClient } from '../mockInternal';
import { createPersistenceManager } from '../persistence/persistenceManager';
import { peerSyncManager, PEER_SYNC_DEFAULT_MAX_AGE } from '../granite/peerSync';
import { toLoading, toSuccess } from '../resolvers/definition/resolverState';
let __TEST_ONLY_DISABLE_DEFER_UNWATCH = false;
export const __testOnlyDisableDeferUnwatch = () => {
  __TEST_ONLY_DISABLE_DEFER_UNWATCH = true;
};
export const __testOnlyEnableDeferUnwatch = () => {
  __TEST_ONLY_DISABLE_DEFER_UNWATCH = false;
};
const constructClient = ({
  resourceRegistry = defaultResourceRegistry
} = {}) => {
  const promiseCache = indexedMap();
  const logger = createLogger();
  const clientId = crypto.randomUUID();
  const devtools = maybeLoadDevtools({
    clientId,
    logger
  });
  const changeManager = createChangeManager({
    devtools: devtools.callbacks
  });
  logger === null || logger === void 0 || logger.debug('startup');
  const stateEmitter = create({
    onEmitError: ({
      error
    }) => {
      logger === null || logger === void 0 || logger.error('error emitting state', {
        error: error.message
      });
      return false;
    }
  });
  const emissionBuffer = createEmissionBuffer({
    onFlush: (instanceKey, state) => {
      var _promiseCache$get, _promiseCache$get2;
      if (!state.loading || (_promiseCache$get = promiseCache.get(instanceKey, 'fresh')) !== null && _promiseCache$get !== void 0 && _promiseCache$get._resolved) {
        promiseCache.delete(instanceKey, 'fresh');
      }
      if (!state.loading || (_promiseCache$get2 = promiseCache.get(instanceKey, 'stale')) !== null && _promiseCache$get2 !== void 0 && _promiseCache$get2._resolved) {
        promiseCache.delete(instanceKey, 'stale');
      }
      stateEmitter.emit(instanceKey, state);
    }
  });
  const persistenceManager = createPersistenceManager();
  const resolverRegistry = createResolverRegistry({
    logger: logger === null || logger === void 0 ? void 0 : logger.withTags({
      component: 'resolverRegistry'
    }),
    persistenceManager
  });
  const groupManager = createGroupManager({
    logger: logger === null || logger === void 0 ? void 0 : logger.withTags({
      component: 'groupManager'
    })
  });
  let collectPeerSync = (__instanceKey, __data, __storedAt, __stale) => {};
  const lifecycleManager = createResourceLifecycleManager({
    devtools: devtools.callbacks,
    logger: logger === null || logger === void 0 ? void 0 : logger.withTags({
      component: 'lifecycleManager'
    }),
    resourceRegistry,
    groupManager,
    changeManager,
    persistenceManager,
    onNodeCollected: instanceKey => {
      var _devtools$callbacks;
      promiseCache.delete(instanceKey, 'fresh');
      promiseCache.delete(instanceKey, 'stale');
      (_devtools$callbacks = devtools.callbacks) === null || _devtools$callbacks === void 0 || _devtools$callbacks.onNodeCollected(instanceKey);
    },
    onStateChange: (instanceKey, state, changeContext, dataChanged) => {
      emissionBuffer.schedule(instanceKey, state);
      if (dataChanged && !state.loading && !state.error && !state.stale && state.data !== undefined && !changeContext.optimistic && changeContext.origin !== 'peer-sync') {
        collectPeerSync(instanceKey, state.data, lifecycleManager.getStoredAt(instanceKey), state.stale);
      }
      logger === null || logger === void 0 || logger.debug('received state change notification', {
        instanceKey,
        changeId: changeContext.changeId,
        originId: changeContext.originId,
        loading: state.loading,
        stale: state.stale,
        error: !!state.error
      });
    },
    onInvalidate: ({
      instanceKey,
      triggeringContext
    }) => {
      const nextContext = changeManager.cascade(triggeringContext);
      const invalidateLogger = logger === null || logger === void 0 ? void 0 : logger.withTags({
        instanceKey,
        changeId: nextContext === null || nextContext === void 0 ? void 0 : nextContext.changeId,
        originId: nextContext === null || nextContext === void 0 ? void 0 : nextContext.originId
      });
      invalidateLogger === null || invalidateLogger === void 0 || invalidateLogger.info('received invalidation request event');
      if (resolverRegistry.isAttached(instanceKey)) {
        invalidateLogger === null || invalidateLogger === void 0 || invalidateLogger.info('requesting resolver refresh');
        resolverRegistry.refresh(instanceKey, nextContext);
      } else {
        invalidateLogger === null || invalidateLogger === void 0 || invalidateLogger.debug('requested invalidation of non-attached resource');
      }
    }
  });
  const peerSync = peerSyncManager({
    clientId,
    getState: instanceKey => lifecycleManager.getState(instanceKey),
    getStoredAt: instanceKey => lifecycleManager.getStoredAt(instanceKey),
    applyBatch: changes => {
      const changeContext = changeManager.start('peer-sync');
      let applied = 0;
      for (const {
        instanceKey,
        data,
        storedAt
      } of changes) {
        const params = lifecycleManager.getParams(instanceKey);
        if (params !== undefined) {
          lifecycleManager.handleStateChange(instanceKey, params, changeContext, toSuccess(data)(), storedAt);
          applied += 1;
        }
      }
      logger === null || logger === void 0 || logger.info('applied peer-sync batch', {
        component: 'peerSync',
        received: changes.length,
        applied
      });
      emissionBuffer.propagationFinished();
    }
  });
  collectPeerSync = peerSync.collect;
  const propagationFinished = () => {
    emissionBuffer.propagationFinished();
    peerSync.flush();
  };
  const unwatchManager = createUnwatchManager(lifecycleManager.detach);
  const refreshInstance = instanceKey => {
    if (resolverRegistry.isAttached(instanceKey)) {
      resolverRegistry.refresh(instanceKey, changeManager.start('poll'));
    }
  };
  const pollManager = createPollManager({
    logger: logger === null || logger === void 0 ? void 0 : logger.withTags({
      component: 'pollManager'
    }),
    onPoll: key => {
      if (groupManager.has(key)) {
        for (const instanceKey of groupManager.get(key)) {
          refreshInstance(instanceKey);
        }
      } else {
        refreshInstance(key);
      }
    }
  });
  let nextWatcherId = 0;
  const watch = ({
    resource,
    params = {},
    instanceKey = resource.identifyInstance(params),
    pollInterval,
    httpClient,
    pollGroup,
    passive = false
  }, callback, __attribution) => {
    var _devtools$callbacks2, _lifecycleManager$get, _mockResolver;
    const watchLogger = logger === null || logger === void 0 ? void 0 : logger.withTags({
      instanceKey
    });
    watchLogger === null || watchLogger === void 0 || watchLogger.info('watching resource');
    const watcherId = nextWatcherId++;
    (_devtools$callbacks2 = devtools.callbacks) === null || _devtools$callbacks2 === void 0 || _devtools$callbacks2.onWatcherAdded(watcherId, instanceKey, __attribution !== null && __attribution !== void 0 ? __attribution : {
      kind: 'external',
      stack: processStack(new Error())
    });
    unwatchManager.clear(instanceKey);

    // Mock interception (test-only, DCE'd in production)
    let __mockResolver = null;
    if (process.env.NODE_ENV !== 'production') {
      if (__mockInternal_isEnabled()) {
        __mockResolver = __mockInternal_getMockResolver(resource, instanceKey);
      }
    }

    // Watch sources
    // Mock boundary: skip source watching when a mock resolver is active
    let sourceUnwatches = null;
    if (resource.sources && !__mockResolver) {
      for (const source of resource.sources) {
        var _sourceUnwatches;
        ((_sourceUnwatches = sourceUnwatches) !== null && _sourceUnwatches !== void 0 ? _sourceUnwatches : sourceUnwatches = []).push(watch({
          resource: source.resource,
          params: source.mapParams(params),
          pollInterval,
          httpClient,
          pollGroup,
          passive
        }, undefined, {
          kind: 'derived',
          parentInstanceKey: instanceKey
        }));
      }
    }

    // If needed, register the poll interval
    let unregisterPoll;
    if (pollInterval && pollInterval > 0) {
      if (pollGroup) {
        groupManager.add(pollGroup, instanceKey);
        const unregisterInterval = pollManager.register(pollGroup, pollInterval);
        unregisterPoll = () => {
          unregisterInterval();
          groupManager.remove(pollGroup, instanceKey);
        };
      } else {
        unregisterPoll = pollManager.register(instanceKey, pollInterval);
      }
    }

    // Subscribe to state changes
    // Note: The callback's fallback must be a new reference per-watch
    const off = stateEmitter.on(instanceKey, callback ? state => callback(state, unwatch) : () => {});

    // Undo all the work we just did
    function unwatch() {
      var _devtools$callbacks3, _unregisterPoll;
      watchLogger === null || watchLogger === void 0 || watchLogger.info('unwatching resource');
      (_devtools$callbacks3 = devtools.callbacks) === null || _devtools$callbacks3 === void 0 || _devtools$callbacks3.onWatcherRemoved(watcherId);

      // Unwatch sources and unregister poll for this watcher unconditionally.
      // Each source has its own refcount, so this cascades correctly.
      // pollManager has its own internal refcounting per interval.
      if (sourceUnwatches) {
        for (const unwatchSource of sourceUnwatches) {
          unwatchSource();
        }
      }
      (_unregisterPoll = unregisterPoll) === null || _unregisterPoll === void 0 || _unregisterPoll();
      if (!passive) {
        resolverRegistry.detach(instanceKey);
      }
      if (off() === 0) {
        if (__TEST_ONLY_DISABLE_DEFER_UNWATCH) {
          lifecycleManager.detach(instanceKey);
        } else {
          unwatchManager.queue(instanceKey);
        }
      }
    }
    if (!passive && !resource.sources && ((_lifecycleManager$get = lifecycleManager.getState(instanceKey)) === null || _lifecycleManager$get === void 0 ? void 0 : _lifecycleManager$get.data) === undefined) {
      const peer = peerSync.pull(instanceKey);
      if (peer !== undefined) {
        var _resource$peerSyncMax, _peer$storedAt;
        // Within the freshness window we adopt the peer's value as-is and skip
        // the fetch. Past it (or if the peer itself flagged it stale) we adopt
        // on the stale side — data shows immediately while attach triggers a
        // refresh — so bounced values can't stay locked in indefinitely.
        const maxAge = (_resource$peerSyncMax = resource.peerSyncMaxAge) !== null && _resource$peerSyncMax !== void 0 ? _resource$peerSyncMax : PEER_SYNC_DEFAULT_MAX_AGE;
        const isStale = peer.stale || Date.now() - ((_peer$storedAt = peer.storedAt) !== null && _peer$storedAt !== void 0 ? _peer$storedAt : 0) >= maxAge;
        const success = toSuccess(peer.data)();
        lifecycleManager.handleStateChange(instanceKey, params, changeManager.start('peer-sync'), isStale ? toLoading()(success) : success, peer.storedAt);
        propagationFinished();
        if (isStale) {
          var _peer$storedAt2;
          logger === null || logger === void 0 || logger.info('adopted stale peer value; triggering refresh', {
            component: 'peerSync',
            instanceKey,
            storedAt: peer.storedAt,
            age: Date.now() - ((_peer$storedAt2 = peer.storedAt) !== null && _peer$storedAt2 !== void 0 ? _peer$storedAt2 : 0),
            peerFlaggedStale: peer.stale
          });
        } else {
          logger === null || logger === void 0 || logger.info('initialized from peer', {
            component: 'peerSync',
            instanceKey
          });
        }
      }
    }
    const resolverToAttach = (_mockResolver = __mockResolver) !== null && _mockResolver !== void 0 ? _mockResolver : resource.resolver;
    let didAttachResolver = false;
    if (resolverToAttach && !passive) {
      watchLogger === null || watchLogger === void 0 || watchLogger.info('attaching resolver');
      didAttachResolver = resolverRegistry.attach({
        resource,
        instanceKey,
        params,
        resolver: resolverToAttach,
        httpClient,
        getState: () => lifecycleManager.getState(instanceKey),
        onResolverUpdate: (resolverState, meta) => {
          var _meta$changeContext, _meta$changeContext2;
          watchLogger === null || watchLogger === void 0 || watchLogger.info('received state update from resolver', {
            changeId: meta === null || meta === void 0 || (_meta$changeContext = meta.changeContext) === null || _meta$changeContext === void 0 ? void 0 : _meta$changeContext.changeId,
            originId: meta === null || meta === void 0 || (_meta$changeContext2 = meta.changeContext) === null || _meta$changeContext2 === void 0 ? void 0 : _meta$changeContext2.originId,
            loading: resolverState.loading,
            stale: resolverState.stale,
            error: !!resolverState.error
          });
          lifecycleManager.handleStateChange(instanceKey, params, meta !== null && meta !== void 0 && meta.changeContext ? changeManager.next(meta.changeContext) : changeManager.start('resolver-update'), resolverState);
          propagationFinished();
        }
      });
    }
    if (!lifecycleManager.isAttached(instanceKey)) {
      watchLogger === null || watchLogger === void 0 || watchLogger.info('attaching resource');
      lifecycleManager.attach({
        params,
        instanceKey,
        // Treat initializations as cascades so that we don't trigger
        // downstream invalidations. This is an (admittedly imperfect) method to
        // prevent refresh storms when lots of invalidation-linked nodes all init at once
        changeContext: changeManager.cascade(changeManager.start('init'))
      });
      propagationFinished();
    } else if (didAttachResolver) {
      const currentState = lifecycleManager.getState(instanceKey);
      if (!currentState || currentState.loading || currentState.stale) {
        resolverRegistry.refresh(instanceKey, changeManager.cascade(changeManager.start('init')));
      }
    }
    return unwatch;
  };
  const getState = ({
    resource,
    params = {},
    instanceKey = resource.identifyInstance(params),
    materialize = true
  }) => {
    const existing = lifecycleManager.getState(instanceKey);
    if (existing || !materialize) {
      return existing;
    }
    const state = lifecycleManager.materialize({
      instanceKey,
      params,
      changeContext: changeManager.start('materialize')
    });
    propagationFinished();
    return state;
  };
  const invalidate = ({
    resource,
    params = {},
    instanceKey = resource.identifyInstance(params)
  }) => {
    const changeContext = changeManager.start('invalidate');
    const invalidateLogger = logger === null || logger === void 0 ? void 0 : logger.withTags({
      instanceKey,
      changeId: changeContext.changeId,
      originId: changeContext.originId
    });
    invalidateLogger === null || invalidateLogger === void 0 || invalidateLogger.info('invalidating resource');
    lifecycleManager.invalidate(instanceKey, changeContext);
    propagationFinished();
  };
  const invalidateAll = ({
    resource: {
      typeName
    }
  }) => {
    const changeContext = changeManager.start('invalidate-all');
    const invalidateLogger = logger === null || logger === void 0 ? void 0 : logger.withTags({
      typeName,
      changeId: changeContext.changeId,
      originId: changeContext.originId
    });
    invalidateLogger === null || invalidateLogger === void 0 || invalidateLogger.info('invalidating all resources of type');
    lifecycleManager.invalidateAll(typeName, changeContext);
    propagationFinished();
  };
  const getStates = ({
    resource
  }) => lifecycleManager.getInstancesForType(resource.typeName);
  const setState = ({
    resource,
    state,
    params = {},
    instanceKey = resource.identifyInstance(params),
    optimistic = false
  }) => {
    const changeContext = changeManager.start('set-state', {
      optimistic
    });
    const setStateLogger = logger === null || logger === void 0 ? void 0 : logger.withTags({
      instanceKey,
      changeId: changeContext.changeId,
      originId: changeContext.originId
    });
    const nextState = typeof state === 'function' ? state(lifecycleManager.getState(instanceKey)) : state;
    if (nextState) {
      var _unwatch;
      setStateLogger === null || setStateLogger === void 0 || setStateLogger.info('setting state');
      let unwatch;

      // watch the full chain for derived resources to ensure all links are available
      if (resource.sources && !lifecycleManager.isAttached(instanceKey)) {
        unwatch = watch({
          resource,
          params,
          instanceKey,
          passive: true
        }, undefined, {
          kind: 'internal',
          reason: 'set-state'
        });
      }
      lifecycleManager.handleStateChange(instanceKey, params, changeContext, nextState);
      propagationFinished();

      // Unwatch after — not strictly necessary at runtime as detachment is deferred,
      // but tests disable the deferral
      (_unwatch = unwatch) === null || _unwatch === void 0 || _unwatch();
    } else {
      setStateLogger === null || setStateLogger === void 0 || setStateLogger.debug('functional state update returned void');
    }
  };
  const getPromise = ({
    resource,
    params = {},
    instanceKey = resource.identifyInstance(params),
    resolveWithStale = false,
    httpClient
  }) => {
    const promiseType = resolveWithStale ? 'stale' : 'fresh';
    const current = promiseCache.get(instanceKey, promiseType);
    if (current) {
      return current;
    }
    const {
      promise,
      resolve,
      reject
    } = withTrackedResolvers();
    const hasData = s => s.data !== undefined;
    const handleStateChange = state => {
      if (!state) {
        return false;
      }
      if (state.error && !(resolveWithStale && hasData(state))) {
        reject(state.error);
        return true;
      }

      // Fresh mode: only settled, non-stale data resolves. A stale instance
      // falls through so getPromise attaches and refetches.
      if (!resolveWithStale && !state.loading && !state.error && !state.stale && hasData(state)) {
        resolve(state);
        return true;
      }

      // Stale mode: resolve as soon as any data exists, even while loading.
      if (resolveWithStale && hasData(state)) {
        resolve(state);
        return true;
      }
      return false;
    };
    const materialized = lifecycleManager.materialize({
      instanceKey,
      params,
      changeContext: changeManager.start('materialize')
    });
    propagationFinished();
    if (handleStateChange(materialized)) {
      promiseCache.set(instanceKey, promiseType, promise);
      return promise;
    }
    watch({
      resource,
      params,
      instanceKey,
      httpClient
    }, (state, unwatch) => {
      if (handleStateChange(state)) {
        unwatch();
      }
    }, {
      kind: 'internal',
      reason: 'get-promise'
    });
    promiseCache.set(instanceKey, promiseType, promise);
    return promise;
  };
  resourceRegistry.emitter.on('schemaChange', event => {
    lifecycleManager.resync({
      added: event.added,
      removed: event.removed,
      changeContext: changeManager.start('schema-change')
    });
  });
  devtools.registerHooks({
    resourceRegistry,
    resolverRegistry,
    lifecycleManager,
    pollManager,
    invalidate,
    setState,
    getPollGroupMembers: () => groupManager.getAllMembers(),
    persistenceManager
  });
  if (process.env.NODE_ENV !== 'production') {
    __mockInternal_registerClient({
      getInstancesForType: typeName => lifecycleManager.getInstancesForType(typeName)
    });
  }
  return {
    getState,
    getStates,
    watch,
    getPromise,
    invalidate,
    invalidateAll,
    setState,
    // Used as a feature flag — null means devtools are off, non-null enables
    // stack capture in hooks. Don't set unconditionally.
    devtoolsId: devtools.devtoolsId,
    teardown: () => peerSync.destroy()
  };
};
let _singleton;

/**
 * Returns the module-level Pulse client, constructing it on first call.
 * Subsequent calls return the same instance — Pulse is intentionally a
 * singleton so hooks, libraries, and app code all share one cache.
 */
export const createClient = () => {
  if (!_singleton) {
    _singleton = constructClient();
  }
  return _singleton;
};

/**
 * Returns the Pulse client singleton. This is the recommended way to obtain
 * a reference to the client outside of React (inside React, use the hooks).
 */
export const getPulseClient = () => createClient();
export const __testOnly_clearClient = () => {
  _singleton = undefined;
};
export const __testOnly_teardownClientIfExists = () => {
  var _singleton2;
  (_singleton2 = _singleton) === null || _singleton2 === void 0 || _singleton2.teardown();
  _singleton = undefined;
};
export const __testOnly_constructClient = opts => {
  const client = constructClient(opts);
  return client;
};