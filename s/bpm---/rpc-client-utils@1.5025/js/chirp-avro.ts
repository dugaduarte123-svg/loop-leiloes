import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["message", "stack", "cause"];
import { HUBSPOT_CORRELATION_ID_KEY } from './types';
import { createCombinedAbortSignal } from './abortSignalUtils';
export class ChirpInternalError extends Error {}
export class ChirpError extends Error {}
export function getAvroGateway({
  auth,
  timeout,
  isLocal = false,
  na1Only = false,
  isHublessAppAuth = false,
  isStreaming = false,
  isRoutedGlobally = false,
  localWorkspace,
  hublet
}) {
  const extraAppAuthPath = isHublessAppAuth && auth === 'app' ? '/hubless' : '';
  if (isLocal) {
    return getLocalAvroGateway(auth, localWorkspace, hublet) + extraAppAuthPath;
  }
  if (isRoutedGlobally && auth === 'external') {
    return '/chirp-frontend-global/v1/gateway';
  }
  if (isRoutedGlobally && auth === 'test') {
    return '/chirp-frontend-global-test/v1/gateway';
  }
  if (na1Only) {
    return `/chirp-frontend-${auth}-na1-proxy/v1/gateway${extraAppAuthPath}`;
  }
  if (auth === 'app' && isStreaming) {
    return `/chirp-frontend-app-stream/v1/gateway${extraAppAuthPath}`;
  }
  if (auth === 'internal' && isStreaming) {
    return `/chirp-frontend-internal-stream/v1/gateway${extraAppAuthPath}`;
  }
  if (auth === 'external' && isStreaming) {
    return '/chirp-frontend-external-stream/v1/gateway';
  }
  if (auth === 'app' && timeout && timeout > 5000) {
    return `/chirp-frontend-app-slow/v1/gateway${extraAppAuthPath}`;
  }
  return `/chirp-frontend-${auth}/v1/gateway${extraAppAuthPath}`;
}
export function getLocalAvroGateway(auth, workspace, hublet) {
  const domain = auth === 'app' || auth === 'external' ? 'hubspotqa' : 'hubteamqa';
  // eslint-disable-next-line hubspot-dev/no-hublet-comparison, hubspot-dev/no-hublet-references
  const hubletSuffix = hublet && hublet !== 'na1' ? `-${hublet}` : '';
  const host = workspace ? `${workspace}.local${hubletSuffix}.${domain}.com` : `local${hubletSuffix}.${domain}.com`;
  return `https://${host}/chirp-frontend-local/v1/gateway`;
}

/**
 * @deprecated This was used only from code generation which has been removed. This will be removed when usage moves to 0
 */

/**
 * @deprecated This was used only from code generation which has been removed. This will be removed when usage moves to 0
 */

/**
 * @deprecated This was used only from code generation which has been removed. This will be removed when usage moves to 0
 */

export const defaultTag = Symbol('defaultTag');
/**
 *
 * Represents an object property marked as `@Default` in Java.
 * These properties are always present on responses, but are optional on requests (empty values will fall back to the default specified on the model).
 * To be able to assign a value to this field, wrap the type in Requestify
 */

/**
 *
 * Represents an object property marked as `@Derived` in Java.
 * These properties are always present on responses, but are completely excluded from request types.
 * Derived fields are computed server-side and cannot be set by clients.
 */
export const derivedTag = Symbol('derivedTag');
export function spreadPropertiesIntoError(error, properties) {
  const spreadableProperties = _objectWithoutPropertiesLoose(properties, _excluded);
  return Object.assign(error, spreadableProperties);
}
export function parseRejectingChirpErrors(response, serviceName) {
  if (response.type === 'data') {
    if ('correlationId' in response) {
      // We don't want to surface this for successful responses yet
      delete response.correlationId;
    }
    return response.data;
  } else if (response.type === 'rpcError') {
    if ('correlationId' in response && response.rpcError) {
      response.rpcError[HUBSPOT_CORRELATION_ID_KEY] = response.correlationId;
      delete response.correlationId;
    }
    if (serviceName !== undefined && response.rpcError) {
      Object.assign(response.rpcError, {
        serviceName
      });
    }
    const error = new ChirpError('CHIRP RPC failed with a known error', {
      cause: response.rpcError
    });
    throw spreadPropertiesIntoError(error, response.rpcError);
  } else if (response.type === 'internalError') {
    if ('correlationId' in response && response.internalError) {
      response.internalError[HUBSPOT_CORRELATION_ID_KEY] = response.correlationId;
      delete response.correlationId;
    }
    if (serviceName !== undefined && response.internalError) {
      Object.assign(response.internalError, {
        serviceName
      });
    }
    const error = new ChirpInternalError('CHIRP RPC failed with a CHIRP internal error', {
      cause: response.internalError
    });
    throw spreadPropertiesIntoError(error, response.internalError);
  } else {
    throw response;
  }
}
export function parseIntoUnion(response, serviceName) {
  if (response.type === 'internalError') {
    if ('correlationId' in response && response.internalError) {
      response.internalError[HUBSPOT_CORRELATION_ID_KEY] = response.correlationId;
      delete response.correlationId;
    }
    if (serviceName !== undefined && response.internalError) {
      Object.assign(response.internalError, {
        serviceName
      });
    }
    const error = new ChirpInternalError('CHIRP RPC failed with a CHIRP internal error', {
      cause: response.internalError
    });
    throw spreadPropertiesIntoError(error, response.internalError);
  }
  if (response.type === 'rpcError') {
    if ('correlationId' in response && response.rpcError) {
      response.rpcError[HUBSPOT_CORRELATION_ID_KEY] = response.correlationId;
    }
    if (serviceName !== undefined && response.rpcError) {
      Object.assign(response.rpcError, {
        serviceName
      });
    }
  }
  if ('correlationId' in response) {
    delete response.correlationId;
  }
  return response;
}
const FIVE_MINUTES_MS = 1000 * 60 * 5;

/**
 * Makes a CHIRP Avro call using the Fetch API.
 * For streaming RPCs, this allows consuming the response as a stream of Server-Sent Events.
 *
 * @param fetcher The fetch function to use
 * @param details The details of the CHIRP RPC
 * @param inputs The inputs for the RPC call
 * @param shouldMakeLocalRequest Whether to use local request handling
 * @param abortSignal Optional AbortSignal to cancel the request
 * @returns A Response object that can be processed as a stream for streaming RPCs
 */
export async function makeChirpAvroCallWithFetch(fetcher, details, inputs, shouldMakeLocalRequest, abortSignal, localWorkspace) {
  const {
    request,
    timeout,
    portalId,
    userId,
    hublet
  } = inputs !== null && inputs !== void 0 ? inputs : {
    request: {}
  };
  const {
    auth,
    serviceName,
    rpcName,
    fingerprint,
    isStreaming,
    na1Only,
    isLocal,
    routingLocality
  } = details;
  // 80% of streams are killed in the BE in < 5 minutes: https://grafana.hubteam.com/d/f8896cca-9c98-4480-bd64-71cdaa5ca749/hs-resources-frontend-metrics?orgId=1&from=now-2w&to=now&timezone=browser&var-ds=iad02&refresh=1m&viewPanel=panel-6
  // Request a timeout of 5 minutes (instead of the advertised 30) to reduce pressure on the BE
  const clientTimeout = isStreaming ? timeout !== null && timeout !== void 0 ? timeout : FIVE_MINUTES_MS : timeout !== null && timeout !== void 0 ? timeout : 5000;
  const url = getFetchUrlPath({
    isLocal: isLocal || shouldMakeLocalRequest,
    auth,
    serviceName,
    rpcName,
    isStreaming,
    clientTimeout,
    na1Only,
    isRoutedGlobally: routingLocality === 'GLOBAL',
    localWorkspace: isLocal ? undefined : localWorkspace,
    hublet
  });
  const headers = {
    'Content-Type': 'application/json'
  };
  const isInternalAuth = auth === 'internal';
  if (fingerprint !== undefined) headers['x-hs-fingerprint'] = fingerprint;
  if (isStreaming) headers['Accept'] = 'text/event-stream';
  if (portalId !== undefined && isInternalAuth) headers['X-Origin-HubId'] = String(portalId);
  if (userId !== undefined && isInternalAuth) headers['X-Origin-UserId'] = String(userId);

  // Create a composite abort signal that combines the timeout and user abort signal
  const signal = createCombinedAbortSignal(clientTimeout, abortSignal);
  const response = await fetcher(url, {
    method: 'POST',
    headers,
    signal,
    body: JSON.stringify(request)
  });
  return response;
}
export function formatChirpAvroMSWSuccessResponse(mockResponse) {
  return {
    type: 'data',
    data: mockResponse
  };
}
export function formatChirpAvroMSWUserErrorResponse(mockErrorResponse) {
  return {
    type: 'rpcError',
    rpcError: mockErrorResponse
  };
}
export function formatChirpAvroMSWInternalErrorResponse(mockErrorResponse) {
  return {
    type: 'internalError',
    internalError: mockErrorResponse
  };
}
function getFetchUrlPath({
  isLocal,
  auth,
  serviceName,
  rpcName,
  isStreaming,
  clientTimeout,
  na1Only = false,
  isRoutedGlobally,
  localWorkspace,
  hublet
}) {
  const gateway = getAvroGateway({
    auth,
    timeout: clientTimeout,
    isLocal,
    na1Only,
    isStreaming,
    isRoutedGlobally,
    localWorkspace,
    hublet
  });
  let path = isStreaming ? `${gateway}/stream/${serviceName}/${rpcName}` : `${gateway}/${serviceName}/${rpcName}`;
  path += `?clienttimeout=${clientTimeout}`;
  return path;
}