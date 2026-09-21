import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["earlyRequest"];
import { getGlobal } from './apiClients/global';
import { makeChirpAvroCallWithFetch } from './chirp-avro';
import { resolveLocalRequest } from './localRequestUtils';
import { createRequestName } from './quick-fetch-utils';
export function getEarlyStreamEntryFor(details, inputs) {
  const key = createRequestName(details, inputs === null || inputs === void 0 ? void 0 : inputs.request);
  const entry = getEarlyStreamEntry(key);
  return entry;
}
export function consumeEarlyStreamEntry(details, inputs) {
  const key = createRequestName(details, inputs === null || inputs === void 0 ? void 0 : inputs.request);
  const entry = getEarlyStreamEntry(key);
  if (entry) {
    removeEarlyStreamEntry(key);
    return entry;
  }
  return undefined;
}
function getEarlyStreamsCache() {
  const g = getGlobal();
  if (!g.__chirpEarlyStreams) {
    g.__chirpEarlyStreams = new Map();
  }
  return g.__chirpEarlyStreams;
}
export function getEarlyStreamEntry(key) {
  return getEarlyStreamsCache().get(key);
}
export function removeEarlyStreamEntry(key) {
  getEarlyStreamsCache().delete(key);
}

/**
 * Starts an early streaming request and stores the Response promise in a global cache.
 * Does not consume the response body; consumers should attach later and stream it.
 */
export async function makeChirpEarlyStreamRequest(fetcher, details, inputs) {
  if (!details.isStreaming) {
    throw new Error('makeEarlyStreamRequest may only be used for streaming RPCs');
  }
  const detailsCopyWithoutEarlyRequest = _objectWithoutPropertiesLoose(details, _excluded);
  const key = createRequestName(detailsCopyWithoutEarlyRequest, inputs === null || inputs === void 0 ? void 0 : inputs.request);
  const existing = getEarlyStreamEntry(key);
  if (existing) {
    return {
      key,
      entry: existing
    };
  }

  // eslint-disable-next-line compat/compat
  const abortController = new AbortController();
  const startTime = Date.now();
  const localService = await resolveLocalRequest(detailsCopyWithoutEarlyRequest.serviceName, inputs === null || inputs === void 0 ? void 0 : inputs.explicitLocalWorkspace);
  const responsePromise = makeChirpAvroCallWithFetch(fetcher, detailsCopyWithoutEarlyRequest, inputs, localService !== null, abortController.signal, localService === null || localService === void 0 ? void 0 : localService.workspace);
  const entry = {
    response: responsePromise,
    abortController,
    startTime
  };
  getEarlyStreamsCache().set(key, entry);
  return {
    key,
    entry
  };
}