import { createEmptyEntry } from './entries/cacheEntry';
import { setResourceErrorMeta } from '../client/errorMeta';
import { timing } from '../metrics/timing';
import { calculateTags } from '../links/discovery/calculateTags';
import { parseTypeName } from '../resources/resource';
import { createGCManager } from './gcManager';
import { produceNextCacheEntry } from './entries/produceNextCacheEntry';
import { tryMarkStale } from './entries/tryMarkStale';
import { createLinkManager } from './linkManager';
import { createNodeStore } from './nodeStore';
export { __testOnlyDisableCacheGC, __testOnlyEnableCacheGC } from './gcManager';
export const createResourceLifecycleManager = ({
  logger,
  resourceRegistry,
  groupManager,
  changeManager,
  onInvalidate,
  onStateChange,
  onNodeCollected,
  devtools,
  persistenceManager
}) => {
  logger === null || logger === void 0 || logger.debug('startup');
  const nodeStore = createNodeStore({
    devtools
  });
  let active = false;
  let stateEffects = [];
  let invalidationEffects = [];
  let refetchEffects = [];
  const enqueueStateEffect = effect => {
    if (active) {
      stateEffects.push(effect);
      return;
    }
    effect();
  };
  const enqueueInvalidationEffect = effect => {
    if (active) {
      invalidationEffects.push(effect);
      return;
    }
    effect();
  };
  const dispatchInvalidation = (instanceKey, changeContext) => {
    if (active) {
      refetchEffects.push(() => {
        onInvalidate({
          instanceKey,
          triggeringContext: changeContext
        });
      });
      return;
    }
    onInvalidate({
      instanceKey,
      triggeringContext: changeContext
    });
  };
  const deferLifecycleEffects = callback => {
    // Re-entrant: a wavefront is already draining. Run inline so anything the
    // callback schedules lands on the active tiers and drains in order at the
    // root.
    if (active) {
      callback();
      return;
    }
    active = true;
    stateEffects = [];
    invalidationEffects = [];
    refetchEffects = [];
    try {
      callback();

      // Prioritized drain: state, then invalidation marking, then refetch.
      //
      // State is the stronger fact — a value that actually arrived this wave —
      // so all state propagation reaches fixpoint before any invalidation is
      // applied. The originId guard in tryMarkStale then drops any same-origin
      // invalidation of a node that already received state: it never marks stale
      // and never dispatches a refetch. That makes "state trumps invalidation"
      // hold regardless of graph shape or the order paths happen to arrive,
      // rather than first-effect-wins.
      //
      // Invalidation marking drains as its own tier before refetches, so every
      // linked node in the invalidation front is marked stale before any node's
      // refetch is dispatched. Within a tier, effects append to the tail and
      // drain breadth-first so the changeId guard can't freeze a node on a
      // partial value from a longer path. Higher tiers always drain first, so a
      // synchronous refetch that feeds new state back in is applied before the
      // next lower-tier effect runs.
      let stateIndex = 0;
      let invalidationIndex = 0;
      let refetchIndex = 0;
      while (stateIndex < stateEffects.length || invalidationIndex < invalidationEffects.length || refetchIndex < refetchEffects.length) {
        if (stateIndex < stateEffects.length) {
          stateEffects[stateIndex++]();
          continue;
        }
        if (invalidationIndex < invalidationEffects.length) {
          invalidationEffects[invalidationIndex++]();
          continue;
        }
        refetchEffects[refetchIndex++]();
      }
    } finally {
      active = false;
      stateEffects = [];
      invalidationEffects = [];
      refetchEffects = [];
    }
  };
  const onChange = (instanceKey, entry, {
    dataChanged,
    flagsChanged
  }) => {
    if (entry.state.error) {
      setResourceErrorMeta(entry.state.error, {
        typeName: parseTypeName(instanceKey),
        instanceKey,
        params: entry.meta.params
      });
    }
    onStateChange(instanceKey, entry.state, entry.meta.changeContext, dataChanged);
    const resource = resourceRegistry.getResource(instanceKey);
    if (resource.persist && dataChanged) {
      persistenceManager === null || persistenceManager === void 0 || persistenceManager.write(instanceKey, entry.state);
    }
    if (resource.onChange) {
      queueMicrotask(() => {
        try {
          var _resource$onChange;
          (_resource$onChange = resource.onChange) === null || _resource$onChange === void 0 || _resource$onChange.call(resource, {
            state: entry.state,
            params: entry.meta.params,
            dataChanged,
            flagsChanged
          });
        } catch (error) {
          logger === null || logger === void 0 || logger.error('error calling onChange', {
            error: error.message
          });
        }
      });
    }
  };
  const linkManager = createLinkManager({
    nodeStore,
    resourceRegistry,
    onInvalidated: dispatchInvalidation,
    onChange,
    schedule: enqueueStateEffect,
    scheduleInvalidation: enqueueInvalidationEffect,
    logger,
    devtools
  });
  const syncTags = linkManager.syncTags;
  const collectNode = (instanceKey, changeContext) => {
    const entry = nodeStore.get(instanceKey);
    if (!entry) {
      return;
    }
    if (entry.meta.changeContext.changeId >= changeContext.changeId) {
      return;
    }
    const result = {
      dataChanged: false,
      flagsChanged: false
    };
    nodeStore.getEmitter(instanceKey).emit('pull', {
      changeContext,
      result
    });
    if (!result.dataChanged && !result.flagsChanged) {
      return;
    }
    const merged = nodeStore.get(instanceKey);
    if (result.dataChanged && !changeContext.optimistic) {
      syncTags(instanceKey, changeContext);
    }
    merged.meta.lastChange = result;
    onChange(instanceKey, merged, result);
    enqueueStateEffect(() => nodeStore.getEmitter(instanceKey).emit('state', {
      changeContext,
      dataChanged: result.dataChanged,
      flagsChanged: result.flagsChanged
    }));
  };
  const gcManager = createGCManager({
    nodes: nodeStore.nodes,
    removeNode: instanceKey => {
      linkManager.removeInstance(instanceKey, changeManager.start('gc'));
      nodeStore.remove(instanceKey);
      groupManager.remove(parseTypeName(instanceKey), instanceKey);
      onNodeCollected(instanceKey);
    },
    logger: logger === null || logger === void 0 ? void 0 : logger.withTags({
      component: 'gcManager'
    })
  });
  const invalidateNode = (instanceKey, changeContext) => {
    const entry = nodeStore.get(instanceKey);
    if (!entry) {
      return;
    }
    const {
      hash
    } = resourceRegistry.getResource(instanceKey);
    const nextEntry = tryMarkStale(entry, hash, changeContext);
    if (!nextEntry) {
      return;
    }
    nodeStore.set(instanceKey, nextEntry);
    onChange(instanceKey, nextEntry, {
      dataChanged: false,
      flagsChanged: true
    });
    devtools === null || devtools === void 0 || devtools.trace({
      changeContext,
      instanceKey,
      parent: 'origin',
      type: 'invalidation'
    });
    dispatchInvalidation(instanceKey, changeContext);
    nodeStore.getEmitter(instanceKey).emit('invalidation', {
      changeContext
    });
  };
  const registerNode = ({
    instanceKey,
    params,
    changeContext,
    registerLogger
  }) => {
    const existing = nodeStore.get(instanceKey);
    if (existing) {
      return {
        entry: existing,
        didCreate: false,
        wasVisible: existing.meta.visible
      };
    }
    registerLogger === null || registerLogger === void 0 || registerLogger.debug('creating node');
    const typeName = parseTypeName(instanceKey);
    groupManager.add(typeName, instanceKey);
    const {
      tags: paramLinkTags
    } = calculateTags({
      typeName,
      params,
      resourceRegistry
    });
    const newNode = createEmptyEntry(params, paramLinkTags);
    const emitter = nodeStore.create(instanceKey, newNode);
    emitter.on('collect', ({
      changeContext: collectContext
    }) => collectNode(instanceKey, collectContext));

    // Intentionally not reporting a trace edge or state change here. Node registration
    // is a multi-step process — we first set up the tag registry and reachable
    // instances by params, then attempt to initialize via links and refresh
    // if not able to initialize. The trace should only be reported after all is said and done.
    devtools === null || devtools === void 0 || devtools.onNodeAdded(instanceKey, changeContext);
    syncTags(instanceKey, changeContext);
    return {
      entry: newNode,
      didCreate: true,
      wasVisible: false
    };
  };
  const requestReplay = (instanceKey, initLogger) => {
    var _nodeStore$get;
    const priorContext = (_nodeStore$get = nodeStore.get(instanceKey)) === null || _nodeStore$get === void 0 ? void 0 : _nodeStore$get.meta.changeContext;
    let parent = null;
    nodeStore.getEmitter(instanceKey).emit('init', {
      onInit: parentInstanceKey => {
        parent = parentInstanceKey;
      }
    });
    const entry = nodeStore.get(instanceKey);
    if (entry && entry.meta.changeContext !== priorContext) {
      initLogger === null || initLogger === void 0 || initLogger.info('initialized from links');
      syncTags(instanceKey, entry.meta.changeContext);
      return [entry, parent];
    }
    return [null, null];
  };
  return {
    resync: ({
      added,
      removed,
      changeContext
    }) => {
      timing.timeResync(() => {
        const affectedTypes = new Set();
        for (const link of [...(added !== null && added !== void 0 ? added : []), ...(removed !== null && removed !== void 0 ? removed : [])]) {
          affectedTypes.add(link.selfTypeName);
          affectedTypes.add(link.otherTypeName);
        }

        // First pass: recalculate param tags (link definitions may have changed)
        for (const typeName of affectedTypes) {
          const instances = groupManager.get(typeName);
          if (instances) {
            for (const instanceKey of [...instances]) {
              const node = nodeStore.get(instanceKey);
              if (node) {
                nodeStore.patch(instanceKey, Object.assign({}, node, {
                  meta: Object.assign({}, node.meta, {
                    paramLinkTags: calculateTags({
                      typeName,
                      params: node.meta.params,
                      resourceRegistry
                    }).tags
                  })
                }));
              }
            }
          }
        }

        // Second pass: nuke + rebuild tags for all affected instances
        for (const typeName of affectedTypes) {
          const instances = groupManager.get(typeName);
          if (instances) {
            for (const instanceKey of instances) {
              syncTags(instanceKey, changeContext);
            }
          }
        }
      });
    },
    isAttached: instanceKey => {
      var _nodeStore$get2;
      return ((_nodeStore$get2 = nodeStore.get(instanceKey)) === null || _nodeStore$get2 === void 0 ? void 0 : _nodeStore$get2.meta.attachedSince) != null;
    },
    getParams: instanceKey => {
      var _nodeStore$get3;
      return (_nodeStore$get3 = nodeStore.get(instanceKey)) === null || _nodeStore$get3 === void 0 ? void 0 : _nodeStore$get3.meta.params;
    },
    getStoredAt: instanceKey => {
      var _nodeStore$get4;
      return (_nodeStore$get4 = nodeStore.get(instanceKey)) === null || _nodeStore$get4 === void 0 ? void 0 : _nodeStore$get4.meta.storedAt;
    },
    getState: instanceKey => {
      const entry = nodeStore.get(instanceKey);
      return entry !== null && entry !== void 0 && entry.meta.visible ? entry.state : undefined;
    },
    materialize: ({
      instanceKey,
      params,
      changeContext
    }) => {
      return timing.timeMaterialize(() => {
        const materializeLogger = logger === null || logger === void 0 ? void 0 : logger.withTags({
          instanceKey,
          changeId: changeContext.changeId,
          originId: changeContext.originId
        });
        materializeLogger === null || materializeLogger === void 0 || materializeLogger.debug('materializing node');
        const {
          entry: node,
          didCreate
        } = registerNode({
          instanceKey,
          params,
          changeContext,
          registerLogger: materializeLogger
        });
        if (!didCreate) {
          return node.meta.visible ? node.state : undefined;
        }
        const [initialized] = requestReplay(instanceKey, materializeLogger);
        gcManager.queue(instanceKey, -1);
        if (initialized) {
          onChange(instanceKey, initialized, {
            dataChanged: true,
            flagsChanged: true
          });
          return initialized.state;
        }
        nodeStore.patch(instanceKey, Object.assign({}, node, {
          meta: Object.assign({}, node.meta, {
            visible: false
          })
        }));
        return undefined;
      });
    },
    attach: ({
      instanceKey,
      params,
      changeContext
    }) => {
      timing.timeAttach(() => {
        const attachLogger = logger === null || logger === void 0 ? void 0 : logger.withTags({
          instanceKey,
          changeId: changeContext.changeId,
          originId: changeContext.originId
        });
        attachLogger === null || attachLogger === void 0 || attachLogger.info('attaching resource');
        gcManager.clear(instanceKey);
        const {
          entry: node,
          didCreate,
          wasVisible
        } = registerNode({
          instanceKey,
          params,
          changeContext,
          registerLogger: attachLogger
        });
        nodeStore.patch(instanceKey, Object.assign({}, node, {
          meta: Object.assign({}, node.meta, {
            attachedSince: Date.now(),
            visible: true
          })
        }));

        // If the node is new to the cache or was previously materialized without
        // data, attempt to populate it from links.
        if (didCreate || !wasVisible) {
          attachLogger === null || attachLogger === void 0 || attachLogger.debug('attempting to populate from links');
          const [initialized, parent] = requestReplay(instanceKey, attachLogger);
          if (initialized) {
            attachLogger === null || attachLogger === void 0 || attachLogger.info('initial state populated', {
              parent
            });
            devtools === null || devtools === void 0 || devtools.traceInit(parent, instanceKey, changeContext);
          }
        }
        const finalizedNode = nodeStore.get(instanceKey);
        const {
          stale,
          loading
        } = finalizedNode.state;

        // If the node is resolved and still stale/loading
        // after population, we should attempt to grab a fresh copy
        if (stale || loading) {
          attachLogger === null || attachLogger === void 0 || attachLogger.debug('initial state requires invalidation');
          devtools === null || devtools === void 0 || devtools.trace({
            changeContext,
            instanceKey,
            parent: 'origin',
            type: 'invalidation'
          });
          onInvalidate({
            instanceKey,
            triggeringContext: changeContext
          });
        }
        onChange(instanceKey, nodeStore.get(instanceKey), {
          dataChanged: true,
          flagsChanged: true
        });
      });
    },
    detach: instanceKey => {
      timing.timeDetach(() => {
        var _node$meta$attachedSi;
        logger === null || logger === void 0 || logger.debug('detaching resource', {
          instanceKey
        });
        const node = nodeStore.get(instanceKey);
        if (!node) {
          logger === null || logger === void 0 || logger.debug('node not found, skipping gc', {
            instanceKey
          });
          return;
        }

        // Intentionally not reporting a state change here (for now), as it
        // would replace the prior state in history w/ same changeId.
        // TODO: Consider providing detaches with a changeId? Would mess
        // with post-detach propagation
        const attachedDuration = Date.now() - ((_node$meta$attachedSi = node.meta.attachedSince) !== null && _node$meta$attachedSi !== void 0 ? _node$meta$attachedSi : 0);
        nodeStore.patch(instanceKey, Object.assign({}, node, {
          meta: Object.assign({}, node.meta, {
            attachedSince: undefined
          })
        }));
        logger === null || logger === void 0 || logger.debug('queueing gc', {
          instanceKey,
          duration: attachedDuration
        });
        gcManager.queue(instanceKey, attachedDuration);
      });
    },
    invalidate: (instanceKey, changeContext) => {
      timing.timeInvalidate(() => {
        deferLifecycleEffects(() => {
          invalidateNode(instanceKey, changeContext);
        });
      });
    },
    invalidateAll: (typeName, changeContext) => {
      timing.timeInvalidateAll(() => {
        const instances = groupManager.get(typeName);
        if (instances) {
          deferLifecycleEffects(() => {
            for (const instanceKey of instances) {
              invalidateNode(instanceKey, changeContext);
            }
          });
        }
      });
    },
    handleStateChange: (sourceInstanceKey, params, changeContext, nextState, storedAt) => {
      timing.timeStateChange(() => {
        const stateChangeLogger = logger === null || logger === void 0 ? void 0 : logger.withTags({
          sourceInstanceKey,
          instanceKey: sourceInstanceKey,
          changeId: changeContext.changeId,
          originId: changeContext.originId
        });
        stateChangeLogger === null || stateChangeLogger === void 0 || stateChangeLogger.info('handling state change', {
          canCascade: changeContext.canCascade
        });
        const {
          entry,
          didCreate
        } = registerNode({
          instanceKey: sourceInstanceKey,
          params,
          changeContext,
          registerLogger: stateChangeLogger === null || stateChangeLogger === void 0 ? void 0 : stateChangeLogger.withTags({
            component: 'registerNode'
          })
        });
        if (didCreate) {
          gcManager.queue(sourceInstanceKey, -1);
        }
        if (entry.meta.changeContext.changeId >= changeContext.changeId) {
          return;
        }
        const {
          hash
        } = resourceRegistry.getResource(sourceInstanceKey);
        const result = produceNextCacheEntry({
          hash,
          currentEntry: entry,
          params: entry.meta.params,
          changeContext,
          nextState,
          storedAt
        });
        if (!result.dataChanged && !result.flagsChanged) {
          if (didCreate) {
            onStateChange(sourceInstanceKey, entry.state, entry.meta.changeContext, false);
          }
          return;
        }
        devtools === null || devtools === void 0 || devtools.trace({
          parent: 'origin',
          type: 'state',
          changeContext,
          instanceKey: sourceInstanceKey
        });
        result.nextEntry.meta.lastChange = {
          dataChanged: result.dataChanged,
          flagsChanged: result.flagsChanged
        };
        nodeStore.set(sourceInstanceKey, result.nextEntry);
        if (result.dataChanged && !changeContext.optimistic) {
          syncTags(sourceInstanceKey, changeContext);
        }
        onChange(sourceInstanceKey, result.nextEntry, {
          dataChanged: result.dataChanged,
          flagsChanged: result.flagsChanged
        });
        deferLifecycleEffects(() => {
          nodeStore.getEmitter(sourceInstanceKey).emit('state', {
            changeContext,
            dataChanged: result.dataChanged,
            flagsChanged: result.flagsChanged
          });
        });
      });
    },
    getInstancesForType: typeName => {
      const instances = groupManager.get(typeName);
      if (!instances) return [];
      const results = [];
      for (const instanceKey of instances) {
        const entry = nodeStore.get(instanceKey);
        if (entry !== null && entry !== void 0 && entry.meta.visible) {
          results.push({
            instanceKey,
            params: entry.meta.params,
            state: entry.state
          });
        }
      }
      return results;
    },
    getAllGCStatuses: () => gcManager.getAllStatuses()
  };
};