import { resolveLocalRequest, shouldForce401 } from './localRequestUtils';
import { createCombinedAbortSignal } from './abortSignalUtils';
import { getAvroGateway, ChirpInternalError } from './chirp-avro';
function makeHubHttpRequest({
  gatewayUrl,
  request,
  headers,
  auth,
  clientTimeout,
  environment,
  hublet,
  portalId,
  calledFrom,
  hubHttpClient
}) {
  return hubHttpClient.post(gatewayUrl, Object.assign({
    data: request,
    headers,
    timeout: clientTimeout,
    query: {
      clienttimeout: String(clientTimeout)
    },
    environment,
    hublet
  }, portalId && auth === 'app' && calledFrom !== 'npmShim' ? {
    portalId
  } : {})).catch(errorResponse => {
    if (errorResponse.status !== 0 && 'responseJSON' in errorResponse) {
      const isAuthError = errorResponse.status === 401;
      return Object.assign({}, isAuthError ? {
        isAuthError: true
      } : {}, errorResponse.responseJSON);
    }
    throw errorResponse;
  });
}
function makeChirpFetchRequest({
  gatewayUrl,
  request,
  headers,
  auth,
  clientTimeout,
  environment,
  hublet,
  rpcFetcherFactory,
  fetcherOverride,
  serviceName
}) {
  if (!fetcherOverride && !rpcFetcherFactory) {
    throw new Error('Either hubHttpClient, fetcherOverride, or rpcFetcherFactory is required');
  }
  const fetcher = fetcherOverride !== null && fetcherOverride !== void 0 ? fetcherOverride : rpcFetcherFactory(auth, environment, hublet);
  const signal = createCombinedAbortSignal(clientTimeout);
  return fetcher(`${gatewayUrl}?clienttimeout=${clientTimeout}`, {
    method: 'POST',
    headers: Object.assign({
      'Content-Type': 'application/json'
    }, headers),
    body: JSON.stringify(request),
    signal
  }).then(response => {
    if (response.status === 401 || shouldForce401()) {
      throw Object.assign(new ChirpInternalError('Unauthorized'), {
        isAuthError: true,
        serviceName
      });
    }
    return response.json();
  });
}
export function dispatchRpcRequest(args) {
  const headers = Object.assign({}, args.headers);
  if (args.portalId !== undefined && (args.auth === 'internal' || args.calledFrom === 'npmShim')) {
    headers['X-Origin-HubId'] = String(args.portalId);
  }
  if (args.userId !== undefined) {
    headers['X-Origin-UserId'] = String(args.userId);
  }
  const argsWithHeaders = Object.assign({}, args, {
    headers
  });
  return args.hubHttpClient ? makeHubHttpRequest(Object.assign({}, argsWithHeaders, {
    hubHttpClient: args.hubHttpClient
  })) : makeChirpFetchRequest(argsWithHeaders);
}
export async function makeChirpAvroCall({
  hubHttpClient,
  details,
  responseParser,
  inputs,
  alternateData,
  calledFrom = 'bend',
  rpcFetcherFactory,
  fetcherOverride
}) {
  var _inputs$request, _ref;
  const {
    timeout,
    portalId,
    userId,
    environment,
    hublet,
    explicitLocalWorkspace
  } = inputs !== null && inputs !== void 0 ? inputs : {};
  const request = (_inputs$request = inputs === null || inputs === void 0 ? void 0 : inputs.request) !== null && _inputs$request !== void 0 ? _inputs$request : {};
  const {
    auth,
    serviceName,
    rpcName,
    fingerprint,
    na1Only,
    isHublessAppAuth,
    routingLocality
  } = details;
  const syncStackError = new Error(`CHIRP RPC failed for ${rpcName}`);
  const clientTimeout = typeof timeout === 'number' ? timeout : 5000;
  const localService = await resolveLocalRequest(serviceName, explicitLocalWorkspace);
  const shouldMakeLocalRequest = localService !== null;
  const headers = {};
  if (fingerprint !== undefined) {
    headers['x-hs-fingerprint'] = fingerprint;
  }
  const gatewayUrl = `${getAvroGateway({
    auth,
    timeout: clientTimeout,
    isLocal: shouldMakeLocalRequest,
    na1Only,
    isHublessAppAuth,
    isRoutedGlobally: routingLocality === 'GLOBAL',
    localWorkspace: localService === null || localService === void 0 ? void 0 : localService.workspace,
    hublet
  })}/${serviceName}/${rpcName}`;
  const data = (_ref = shouldMakeLocalRequest ? undefined : alternateData) !== null && _ref !== void 0 ? _ref : dispatchRpcRequest({
    gatewayUrl,
    request,
    headers,
    auth,
    clientTimeout,
    environment,
    hublet,
    portalId,
    userId,
    calledFrom,
    hubHttpClient,
    rpcFetcherFactory,
    fetcherOverride,
    serviceName
  });
  return data.then(response => responseParser(response, serviceName)).catch(error => {
    syncStackError.cause = error;
    throw syncStackError;
  });
}