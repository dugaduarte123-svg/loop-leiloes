import { createEntry } from './cacheEntry';
const compareHashes = (currentHash, nextHash, hashMode, logger) => {
  if (currentHash == null || nextHash == null) {
    return currentHash !== nextHash;
  }
  switch (hashMode) {
    case 'EQUAL':
      {
        return currentHash !== nextHash;
      }
    case 'GREATER':
      {
        return Number(nextHash) > Number(currentHash);
      }
    default:
      {
        logger === null || logger === void 0 || logger.error('encountered invalid hash mode', {
          hashMode
        });
        return true;
      }
  }
};
export const produceNextCacheEntry = ({
  params,
  hash,
  currentEntry,
  nextState,
  changeContext,
  storedAt,
  logger
}) => {
  if (nextState === currentEntry.state || changeContext.changeId < currentEntry.meta.changeContext.changeId) {
    return {
      nextEntry: currentEntry,
      dataChanged: false,
      flagsChanged: false
    };
  }
  const flagsChanged = currentEntry.state.loading !== nextState.loading || currentEntry.state.stale !== nextState.stale || currentEntry.state.error !== nextState.error;
  const nextHash = nextState.data !== undefined ? hash.create(nextState.data) : undefined;
  const dataChanged = compareHashes(currentEntry.meta.hash, nextHash, hash.mode, logger);
  if (!dataChanged && !flagsChanged) {
    return {
      nextEntry: currentEntry,
      dataChanged: false,
      flagsChanged: false
    };
  }

  // Preserve the caller's exact state reference whenever we can, so consumers
  // (e.g. optimistic-mutation rollback in executeMutation) read back the same
  // object they wrote. The only case that forces a copy is a flags-only change
  // where the caller handed us a *different* data reference that still hashes
  // equal (custom collapsing hash) — there we must splice the previous data
  // reference back in to keep data-identity stable for memoization, which
  // unavoidably breaks reference identity for that write.
  let state = nextState;
  if (!dataChanged && nextState.data !== currentEntry.state.data) {
    const clonedState = Object.assign({}, nextState);
    clonedState.data = currentEntry.state.data;
    state = clonedState;
  }
  return {
    nextEntry: createEntry({
      state,
      meta: {
        attachedSince: currentEntry.meta.attachedSince,
        changeContext,
        hash: nextHash,
        params,
        paramLinkTags: currentEntry.meta.paramLinkTags,
        // Both tag sets are the record the bus registrations are derived from,
        // so they have to survive a write. syncTags recomputes dataLinkTags and
        // rebuilds the bus from it in the same pass; resync rewrites
        // paramLinkTags directly. Dropping either here leaves the bus
        // propagating a match the node can no longer describe, so link
        // transforms see no matched contexts.
        dataLinkTags: currentEntry.meta.dataLinkTags,
        storedAt: dataChanged ? storedAt !== null && storedAt !== void 0 ? storedAt : Date.now() : currentEntry.meta.storedAt
      }
    }),
    dataChanged,
    flagsChanged
  };
};