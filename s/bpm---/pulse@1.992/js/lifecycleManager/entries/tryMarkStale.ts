import { produceNextCacheEntry } from './produceNextCacheEntry';
import { markStale } from '../../resolvers/definition/resolverState';
export const tryMarkStale = (entry, hash, changeContext) => {
  if (entry.meta.changeContext.originId >= changeContext.originId) {
    return null;
  }
  const {
    nextEntry,
    flagsChanged
  } = produceNextCacheEntry({
    params: entry.meta.params,
    hash,
    currentEntry: entry,
    nextState: markStale()(entry.state),
    changeContext
  });
  const {
    stale,
    loading,
    error
  } = nextEntry.state;
  if (!flagsChanged && !(!loading && stale && error)) {
    return null;
  }
  return nextEntry;
};