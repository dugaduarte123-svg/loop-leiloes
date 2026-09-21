import { buildHttpRpcPath } from './internal';
import { readUnhandledEnumCase } from './types';
import { parseIntoUnion, parseRejectingChirpErrors, ResultUnion } from './chirp-avro';
import { getRpcFetcher, makeChirpAvroCall } from './chirp-avro-fetch';
import { createBffClient, defineBff } from './chirp-bff';
import { createStreamHandler } from './chirp-avro-streaming';
// these imports must be in this order for mocking reasons
export { defaultDismissErrorWithoutHandling } from './internal';
export { convertJsonToFieldValueAvro, convertFieldValueAvroToJson } from './internal/fieldValueConverter';
import { defaultDismissErrorWithoutHandling } from '.';
export { makeChirpEarlyRequest, getChirpEarlyRequestName } from './chirp-quick-fetch';
import { getChirpEarlyRequest } from './chirp-quick-fetch';
export { makeBffEarlyRequest, getBffEarlyRequestName } from './chirp-bff-quick-fetch';
import { getBffEarlyRequest } from './chirp-bff-quick-fetch';
export { makeChirpEarlyStreamRequest, getEarlyStreamEntryFor, consumeEarlyStreamEntry } from './chirp-streaming-quick-fetch';
import { impersonateHubHttp } from './internal/axios-utils';
export { defineBff, readUnhandledEnumCase };
export { formatChirpAvroMSWSuccessResponse, formatChirpAvroMSWUserErrorResponse, formatChirpAvroMSWInternalErrorResponse, ChirpError, ChirpInternalError } from './chirp-avro';
export { formatChirpAvroMSWStreamResponse, formatChirpAvroMSWStreamErrorResponse, formatChirpAvroMSWSuccessStreamResponse } from './chirp-avro-streaming-msw';
export { createCombinedAbortSignal } from './abortSignalUtils';
export { mergeOverrides } from './mergeOverrides';

/** @deprecated prefer createRpcClientV2 */
export function createRpcClientV1(options) {
  const httpRpcClient = createHttpRpcClientV1(options);
  function executeRemoteProcedure(details, inputs) {
    return httpRpcClient.call(details, inputs);
  }
  return {
    call: executeRemoteProcedure
  };
}
export function createHttpRpcClientV2({
  hubHttpClient
}) {
  function executeRemoteProcedure(details, {
    pathParameters,
    queryParameters,
    data,
    timeout
  }) {
    const path = buildHttpRpcPath(details, pathParameters);
    const syncStackError = new Error(`HTTP RPC failed for ${details.method}-/${path}`);
    let options = undefined;
    if (data) {
      options = options || {};
      options.data = data;
    }
    if (queryParameters) {
      options = options || {};
      options.query = queryParameters;
    }
    if (timeout !== undefined) {
      options = options || {};
      options.timeout = timeout;
    }
    const apiPromise = hubHttpClient[details.method](path, options);
    return apiPromise.catch(error => {
      syncStackError.cause = error;
      throw syncStackError;
    });
  }
  return {
    call: executeRemoteProcedure
  };
}
/**
 * This client factory takes a `hub-http` client and returns a client that
 * executes network requests as RPCs.
 *
 * An RPC (Remote Procedure Call) is a network request where the details of the
 * network have been abstracted away. In other words, RPCs are calls to typed
 * async functions that make network requests under the hood. The goal is to
 * minimize time spent thinking about network details (HTTP verbs, url
 * sanitization, CHIRP query names, etc.).
 *
 * This factory is suffixed "V2" because it is guaranteed to never change in a
 * breaking way. If features incompatible with this client factory are added
 * in the future, this client factory will remain available and a new "V3" will
 * be exposed as a sibling for new consumers.
 *
 * ```
 * // kudos service contains generated code
 * import { getKudos } from 'kudos-service/client';
 * import { createRpcClientV1 } from 'rpc-client-utils';
 *
 * const rpcClient = createRpcClientV1({ hubHttpClient: hubHttpClient });
 *
 * const kudos = await rpcClient.call(getKudos, {
 *   // depending on the RPC, data and pathParameters may also be passed
 *   queryParameters: {
 *     hubspotter: 'jdoe'
 *   }
 * });
 * ```
 */
export function createRpcClientV2(options) {
  const effectiveHubHttpClient = 'hubHttpClient' in options ? options.hubHttpClient : impersonateHubHttp(options.axiosClient);
  const useChirpFetch = '__do_not_use_internal_chirp_fetch_only' in options && options.__do_not_use_internal_chirp_fetch_only === true;
  const httpRpcClient = createHttpRpcClientV2({
    hubHttpClient: effectiveHubHttpClient
  });
  const chirpAvroRpcClient = createChirpAvroRpcClientV1({
    hubHttpClient: useChirpFetch ? undefined : effectiveHubHttpClient,
    fetchClient: 'fetchClient' in options ? options.fetchClient : undefined
  });
  const bffClient = createBffClient({
    hubHttpClient: useChirpFetch ? undefined : effectiveHubHttpClient,
    fetcherOverride: 'fetchClient' in options ? options.fetchClient : undefined,
    rpcFetcherFactory: getRpcFetcher
  });
  const rpcClient = {};
  function executeRemoteProcedure(details, inputs) {
    if (!details) {
      throw new Error('RPC details object is undefined. Please ensure RPC is properly initialized.');
    }
    if (details.bffHash) {
      const bffDetails = details;
      const bffInputs = inputs;
      return bffClient.call(bffDetails, bffInputs, getBffEarlyRequest({
        details: bffDetails,
        inputs: bffInputs,
        name: bffInputs === null || bffInputs === void 0 ? void 0 : bffInputs.earlyRequestName
      }));
    } else if (details.method) {
      return httpRpcClient.call(details, inputs);
    } else {
      return chirpAvroRpcClient.call(details, inputs);
    }
  }
  function callWithResultUnion(details, inputs) {
    if (details.method || details.bffHash) {
      throw new Error('callWithResultUnion is not implemented for non-avro RPCs.');
    }
    return chirpAvroRpcClient.callWithResultUnion(details, inputs);
  }
  function stream(details, inputs) {
    if (details.method || details.bffHash || 'gateway' in details || !details.isStreaming) {
      throw new Error('stream is only implemented for streaming Avro RPCs.');
    }
    return chirpAvroRpcClient.stream(details, inputs);
  }
  Object.assign(rpcClient, {
    call: executeRemoteProcedure,
    callWithResultUnion,
    stream
  });
  return rpcClient;
}

/** @deprecated prefer createHttpRpcClientV2 */
export function createHttpRpcClientV1({
  hubHttpClient,
  dismissErrorWithoutHandling = error => defaultDismissErrorWithoutHandling(error)
}) {
  function executeRemoteProcedure(details, {
    pathParameters,
    queryParameters,
    data,
    timeout
  }) {
    const path = buildHttpRpcPath(details, pathParameters);
    const syncStackError = new Error(`HTTP RPC failed for ${details.method}-/${path}`);
    let options = undefined;
    if (data) {
      options = options || {};
      options.data = data;
    }
    if (queryParameters) {
      options = options || {};
      options.query = queryParameters;
    }
    if (timeout !== undefined) {
      options = options || {};
      options.timeout = timeout;
    }
    const apiPromise = hubHttpClient[details.method](path, options);
    return apiPromise.catch(error => {
      dismissErrorWithoutHandling(syncStackError);
      throw error;
    });
  }
  return {
    call: executeRemoteProcedure
  };
}
export function createChirpAvroRpcClientV1({
  hubHttpClient,
  fetchClient
}) {
  function call(details, inputs) {
    return makeChirpAvroCall({
      hubHttpClient,
      details,
      responseParser: parseRejectingChirpErrors,
      inputs,
      alternateData: getChirpEarlyRequest({
        details,
        requestObject: inputs,
        name: inputs === null || inputs === void 0 ? void 0 : inputs.earlyRequestName
      }),
      fetcherOverride: fetchClient
    });
  }
  function callWithResultUnion(details, inputs) {
    return makeChirpAvroCall({
      hubHttpClient,
      details,
      responseParser: parseIntoUnion,
      inputs,
      alternateData: getChirpEarlyRequest({
        details,
        requestObject: inputs,
        name: inputs === null || inputs === void 0 ? void 0 : inputs.earlyRequestName
      }),
      fetcherOverride: fetchClient
    });
  }

  // Create a wrapper that passes the fetch client to createStreamHandler
  function stream(details, inputs) {
    if (!fetchClient) {
      throw new Error('Streaming RPCs require a fetchClient to be provided when creating the RPC client. ' + 'Please provide a fetchClient in the options: createRpcClientV2({ hubHttpClient, fetchClient })');
    }
    return createStreamHandler(details, inputs, fetchClient);
  }
  return {
    call,
    callWithResultUnion,
    stream
  };
}
export const bendPackagePlugin = {
  name: 'rpc-client-utils-shameful-fake-plugin'
};