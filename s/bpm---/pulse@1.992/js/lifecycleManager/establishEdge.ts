import { produceNextCacheEntry } from './entries/produceNextCacheEntry';
import { tryMarkStale } from './entries/tryMarkStale';
import { toError } from '../resolvers/definition/resolverState';

/** A correlated context pair for one tag matched between parent and child. */

const tagsForLink = (linkKey, paramTags, dataTags) => {
  const fromParams = paramTags === null || paramTags === void 0 ? void 0 : paramTags.get(linkKey);
  const fromData = dataTags === null || dataTags === void 0 ? void 0 : dataTags.get(linkKey);
  if (!fromParams) {
    return fromData !== null && fromData !== void 0 ? fromData : null;
  }
  if (!fromData) {
    return fromParams;
  }
  return new Set([...fromParams, ...fromData]);
};

/**
 * Reconstruct every matched tag between two instances and the per-side context
 * each contributed, from the tags retained on each node's meta. Only the first
 * matched tag actually drives a propagation (changeId dedup), but the firing
 * transform gets the full set here so it can join across all matches in one
 * pass.
 */
const computeMatchedContexts = (linkKey, parentMeta, childMeta) => {
  var _parentMeta$dataLinkT, _childMeta$dataLinkTa;
  const parentData = (_parentMeta$dataLinkT = parentMeta.dataLinkTags) !== null && _parentMeta$dataLinkT !== void 0 ? _parentMeta$dataLinkT : null;
  const childData = (_childMeta$dataLinkTa = childMeta.dataLinkTags) !== null && _childMeta$dataLinkTa !== void 0 ? _childMeta$dataLinkTa : null;
  const parentTags = tagsForLink(linkKey, parentMeta.paramLinkTags, parentData === null || parentData === void 0 ? void 0 : parentData.tags);
  const childTags = tagsForLink(linkKey, childMeta.paramLinkTags, childData === null || childData === void 0 ? void 0 : childData.tags);
  if (!parentTags || !childTags) {
    return [];
  }
  const [smaller, larger] = parentTags.size <= childTags.size ? [parentTags, childTags] : [childTags, parentTags];
  const matches = [];
  for (const tag of smaller) {
    var _parentData$contexts, _childData$contexts;
    if (!larger.has(tag)) {
      continue;
    }
    matches.push({
      parent: parentData === null || parentData === void 0 || (_parentData$contexts = parentData.contexts) === null || _parentData$contexts === void 0 ? void 0 : _parentData$contexts.get(linkKey, tag),
      child: childData === null || childData === void 0 || (_childData$contexts = childData.contexts) === null || _childData$contexts === void 0 ? void 0 : _childData$contexts.get(linkKey, tag)
    });
  }
  return matches;
};
export const establishEdge = (ctx, childKey, parentKey, edge, childHash, parentContext, childContext) => {
  const parentEmitter = ctx.nodeStore.getEmitter(parentKey);
  const childEmitter = ctx.nodeStore.getEmitter(childKey);
  const offs = [];
  const {
    behavior,
    resolve
  } = edge;
  if (behavior.state && resolve) {
    const applyTransform = ({
      changeContext,
      dataChanged = true,
      flagsChanged = true
    }, bypassWaveGuard = false) => {
      const childEntry = ctx.nodeStore.get(childKey);
      if (!childEntry) {
        var _ctx$logger;
        (_ctx$logger = ctx.logger) === null || _ctx$logger === void 0 || _ctx$logger.error('child entry not found');
        return;
      }
      if (!bypassWaveGuard && childEntry.meta.changeContext.changeId >= changeContext.changeId) {
        return;
      }
      const parentEntry = ctx.nodeStore.get(parentKey);
      if (!parentEntry) {
        var _ctx$logger2;
        (_ctx$logger2 = ctx.logger) === null || _ctx$logger2 === void 0 || _ctx$logger2.error('parent entry not found');
        return;
      }
      let matchedContexts;
      const getMatchedContexts = () => {
        var _matchedContexts;
        return (_matchedContexts = matchedContexts) !== null && _matchedContexts !== void 0 ? _matchedContexts : matchedContexts = computeMatchedContexts(edge.linkKey, parentEntry.meta, childEntry.meta);
      };
      let result;
      try {
        var _resolve;
        const nextState = (_resolve = resolve({
          dataChanged,
          flagsChanged,
          parent: {
            state: parentEntry.state,
            params: parentEntry.meta.params,
            context: parentContext
          },
          child: {
            state: childEntry.state,
            params: childEntry.meta.params,
            context: childContext
          },
          getContexts: getMatchedContexts
        })) !== null && _resolve !== void 0 ? _resolve : childEntry.state;
        result = produceNextCacheEntry({
          hash: childHash,
          currentEntry: childEntry,
          params: childEntry.meta.params,
          changeContext,
          nextState
        });
      } catch (error) {
        var _ctx$logger4;
        if (changeContext.optimistic) {
          var _ctx$logger3;
          // Child is left unchanged. On rollback, the parent reverts to its
          // pre-optimistic state and re-derives the child via full propagation.
          // If resolve still throws with the rolled-back data, the non-optimistic
          // error path below will apply the error state to the child.
          (_ctx$logger3 = ctx.logger) === null || _ctx$logger3 === void 0 || _ctx$logger3.error('optimistic propagation: resolve threw', {
            error: error.message,
            parentKey,
            childKey
          });
          return;
        }
        (_ctx$logger4 = ctx.logger) === null || _ctx$logger4 === void 0 || _ctx$logger4.error('error applying transform', {
          error: error.message
        });
        const nextState = toError(error)(childEntry.state);
        result = produceNextCacheEntry({
          hash: childHash,
          currentEntry: childEntry,
          params: childEntry.meta.params,
          changeContext,
          nextState
        });
        if (result.dataChanged || result.flagsChanged) {
          ctx.nodeStore.set(childKey, result.nextEntry);
          ctx.onChange(childKey, result.nextEntry, result);
        }

        // Don't cascade — the error was produced by this edge's resolve,
        // not by the parent's state.
        return;
      }
      if (!result.dataChanged && !result.flagsChanged) {
        return;
      }
      ctx.nodeStore.set(childKey, result.nextEntry);
      return result;
    };
    offs.push(parentEmitter.on('state', event => {
      ctx.schedule(() => childEmitter.emit('collect', {
        changeContext: event.changeContext
      }));
    }));
    offs.push(childEmitter.on('pull', event => {
      var _parentEntry$meta$las, _parentEntry$meta$las2, _event$result, _event$result2, _ctx$devtools;
      const parentEntry = ctx.nodeStore.get(parentKey);
      if (!parentEntry) {
        return;
      }
      if (parentEntry.meta.changeContext.changeId < event.changeContext.changeId) {
        return;
      }
      const result = applyTransform({
        changeContext: event.changeContext,
        dataChanged: (_parentEntry$meta$las = parentEntry.meta.lastChange) === null || _parentEntry$meta$las === void 0 ? void 0 : _parentEntry$meta$las.dataChanged,
        flagsChanged: (_parentEntry$meta$las2 = parentEntry.meta.lastChange) === null || _parentEntry$meta$las2 === void 0 ? void 0 : _parentEntry$meta$las2.flagsChanged
      }, true);
      if (!result) {
        return;
      }
      (_event$result = event.result).dataChanged || (_event$result.dataChanged = result.dataChanged);
      (_event$result2 = event.result).flagsChanged || (_event$result2.flagsChanged = result.flagsChanged);
      (_ctx$devtools = ctx.devtools) === null || _ctx$devtools === void 0 || _ctx$devtools.trace({
        parent: 'propagation',
        type: 'state',
        changeContext: event.changeContext,
        instanceKey: childKey,
        parentInstanceKey: parentKey
      });
    }));

    // Initialization: child requests initialization > parent replays its state
    offs.push(childEmitter.on('init', event => {
      var _ctx$nodeStore$get;
      const changeContext = (_ctx$nodeStore$get = ctx.nodeStore.get(parentKey)) === null || _ctx$nodeStore$get === void 0 ? void 0 : _ctx$nodeStore$get.meta.changeContext;
      if (changeContext && applyTransform({
        changeContext
      })) {
        event.onInit(parentKey);
      }
    }));
  }
  if (edge.behavior.invalidation) {
    const invalidate = changeContext => {
      var _ctx$devtools2;
      const childEntry = ctx.nodeStore.get(childKey);
      if (!childEntry) {
        return false;
      }
      const nextEntry = tryMarkStale(childEntry, childHash, changeContext);
      if (!nextEntry) {
        return false;
      }
      (_ctx$devtools2 = ctx.devtools) === null || _ctx$devtools2 === void 0 || _ctx$devtools2.trace({
        changeContext,
        instanceKey: childKey,
        parent: 'propagation',
        type: 'invalidation',
        parentInstanceKey: parentKey
      });
      ctx.nodeStore.set(childKey, nextEntry);
      ctx.onChange(childKey, nextEntry, {
        dataChanged: false,
        flagsChanged: true
      });
      ctx.onInvalidated(childKey, changeContext);
      ctx.nodeStore.getEmitter(childKey).emit('invalidation', {
        changeContext
      });
      return true;
    };

    // Invalidation: parent invalidated > invalidate child. Deferred onto the
    // invalidation tier so all of this wave's state propagation settles first;
    // if the child also receives fresh state this wave, tryMarkStale's originId
    // guard then drops this invalidation (see deferLifecycleEffects).
    offs.push(parentEmitter.on('invalidation', ({
      changeContext
    }) => {
      if (!changeContext.optimistic) {
        ctx.scheduleInvalidation(() => invalidate(changeContext));
      }
    }));

    // Cascading invalidation: parent data changes > mark child stale
    if (!edge.behavior.state) {
      offs.push(parentEmitter.on('state', ({
        dataChanged,
        changeContext
      }) => {
        if (dataChanged && changeContext.canCascade && !changeContext.optimistic) {
          ctx.scheduleInvalidation(() => invalidate(changeContext));
        }
      }));
    }
  }
  return () => offs.forEach(off => off());
};