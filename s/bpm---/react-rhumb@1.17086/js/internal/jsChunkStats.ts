import { performanceGetEntriesByType } from './navigation';
export const STATIC_DOMAIN_REGEX = /https:\/\/(static|local)\.hsappstatic\.net\//;

// If the duration of the request is <= 10ms mark the request as a cache hit.
export const CACHE_DURATION_MS = 10;
export const getJSChunkData = finishedTimestamp => {
  const entries = performanceGetEntriesByType('resource');
  if (!entries) {
    return null;
  }
  const jsEntries = entries.filter(entry => {
    var _entry$name;
    return ((_entry$name = entry.name) === null || _entry$name === void 0 ? void 0 : _entry$name.endsWith('.js')) && STATIC_DOMAIN_REGEX.test(entry.name) && entry.startTime < finishedTimestamp;
  });
  if (jsEntries.length === 0) {
    return null;
  }
  const numJSChunksCached = jsEntries.filter(entry => entry.duration <= CACHE_DURATION_MS).length;
  return {
    numJSChunksLoaded: jsEntries.length,
    numJSChunksCached,
    numJSChunksUncached: jsEntries.length - numJSChunksCached
  };
};