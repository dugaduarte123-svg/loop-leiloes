import { makeChirpAvroCallWithFetch, ChirpInternalError, spreadPropertiesIntoError } from './chirp-avro';
import streamFn from './streamClient';
import { resolveLocalRequest } from './localRequestUtils';
import { consumeEarlyStreamEntry, getEarlyStreamEntryFor } from './chirp-streaming-quick-fetch';

/**
 * Creates a handler for streaming RPC responses.
 *
 * The returned StreamHandler extends Promise and supports both callback and Promise patterns:
 * - Use .onConnected() to be notified when the connection is established
 * - Use .onMessage() to handle data chunks (including domain errors)
 * - Use .then() to handle stream completion
 * - Use .catch() to handle transport errors
 * - Use .abort() to stop the stream
 *
 * @param details The details of the streaming RPC
 * @param inputs The inputs for the RPC call
 * @param fetchClient The fetch client to use for making requests
 * @returns A StreamHandler that allows handling data and supports Promise patterns
 */
export function createStreamHandler(details, inputs, fetchClient) {
  const chirpFetch = fetchClient;
  let entryCallback = null;
  let connectedCallback = null;
  let promiseResolve = null;
  let promiseReject = null;
  let abortController = null;
  let streamActive = false;

  // Create base promise
  const promise = new Promise((resolve, reject) => {
    promiseResolve = resolve;
    promiseReject = reject;
  });

  // Add streaming handler methods to promise
  const handler = Object.assign(promise, {
    onMessage(callback) {
      entryCallback = callback;
      void startStreamIfReady();
      return handler;
    },
    onConnected(callback) {
      connectedCallback = callback;
      return handler;
    },
    abort() {
      if (abortController && streamActive) {
        abortController.abort();
        streamActive = false;

        // Clean up resources and resolve the promise
        if (promiseResolve) {
          promiseResolve();
        }
      }
    }
  });

  // Start streaming when callback is ready
  async function startStreamIfReady() {
    if (!entryCallback || streamActive) {
      return; // Wait until entry callback is set and ensure we don't start multiple streams
    }
    const syncStackError = new Error(`CHIRP streaming RPC failed for ${details.rpcName}`);
    const {
      serviceName
    } = details;
    try {
      var _connectedCallback;
      // eslint-disable-next-line compat/compat
      abortController = new AbortController();
      streamActive = true;
      const localService = await resolveLocalRequest(serviceName, inputs === null || inputs === void 0 ? void 0 : inputs.explicitLocalWorkspace);
      const shouldMakeLocalRequest = localService !== null;
      const makeNormalFetch = () => makeChirpAvroCallWithFetch(chirpFetch, details, inputs, shouldMakeLocalRequest, abortController.signal, localService === null || localService === void 0 ? void 0 : localService.workspace);

      // If an early stream exists for the same key, consume it; otherwise start a new one
      const earlyEntry = getEarlyStreamEntryFor(details, inputs);
      let response;
      if (earlyEntry) {
        // Detach early controller, we'll manage cancellation locally; do not abort existing response
        consumeEarlyStreamEntry(details, inputs);
        try {
          response = await earlyEntry.response;
          if (!response.ok) {
            var _response$body;
            (_response$body = response.body) === null || _response$body === void 0 || _response$body.cancel().catch(() => {});
            response = await makeNormalFetch();
          }
        } catch (_unused) {
          response = await makeNormalFetch();
        }
      } else {
        response = await makeNormalFetch();
      }
      (_connectedCallback = connectedCallback) === null || _connectedCallback === void 0 || _connectedCallback();
      await streamFn(response, {
        onProgress: data => {
          if (data.type === 'internalError') {
            const internalErrorResponse = data;
            Object.assign(internalErrorResponse.internalError, {
              serviceName
            });
            const chirpInternalError = new ChirpInternalError('CHIRP RPC failed with a CHIRP internal error', {
              cause: internalErrorResponse.internalError
            });
            spreadPropertiesIntoError(chirpInternalError, internalErrorResponse.internalError);
            syncStackError.cause = chirpInternalError;
            streamActive = false;
            if (promiseReject) promiseReject(syncStackError);
            return;
          }
          if (entryCallback && streamActive) {
            entryCallback(data);
          }
        },
        onError: error => {
          if (!streamActive) return; // Ignore errors after abort

          Object.assign(error, {
            serviceName
          });
          streamActive = false;
          const chirpInternalError = new ChirpInternalError('CHIRP RPC failed with a CHIRP internal error', {
            cause: error
          });
          syncStackError.cause = chirpInternalError;
          if (promiseReject) promiseReject(syncStackError);
        },
        onClose: () => {
          if (!streamActive) return; // Ignore close after abort

          streamActive = false;
          if (promiseResolve) promiseResolve();
        },
        signal: abortController.signal // Pass the abort signal to the stream handler
      });
    } catch (error) {
      if (!streamActive) return; // Ignore errors after abort

      streamActive = false;
      const typedError = error instanceof Error ? error : new Error(String(error));
      Object.assign(typedError, {
        serviceName
      });
      const chirpInternalError = new ChirpInternalError('CHIRP RPC failed with a CHIRP internal error', {
        cause: typedError
      });
      syncStackError.cause = chirpInternalError;
      if (promiseReject) {
        promiseReject(syncStackError);
      }
    }
  }
  return handler;
}