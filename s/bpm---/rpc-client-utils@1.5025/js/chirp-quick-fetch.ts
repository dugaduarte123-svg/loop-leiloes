import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["earlyRequest"];
import quickFetch from 'quick-fetch';
import { getAvroGateway, parseRejectingChirpErrors } from './chirp-avro';
import { createRequestName, getBaseUrlForAuth, getInternalAuthToken, getInternalBaseUrlFromHostname } from './quick-fetch-utils';
export { getInternalBaseUrlFromHostname };

/**
 * Makes a chirp early request using quick-fetch.
 *
 * This REQUIRES the details object from `/earlyRequest/{SERVICE}.early.ts for tree shaking purposes.
 *
 * To receive this data, use the normal details object in a call. If the data is ready, it will be returtned.
 */
export const makeChirpEarlyRequest = (details, inputs) => {
  const {
    request,
    timeout,
    earlyRequestName
  } = inputs;
  const {
    auth,
    serviceName,
    rpcName,
    fingerprint,
    na1Only,
    routingLocality
  } = details;
  const detailsCopyWithoutEarlyRequest = _objectWithoutPropertiesLoose(details, _excluded);
  const requestName = earlyRequestName !== null && earlyRequestName !== void 0 ? earlyRequestName : createRequestName(detailsCopyWithoutEarlyRequest, request);
  const clientTimeout = typeof timeout === 'number' ? timeout : 5000;
  const endpointUrlBase = `${quickFetch.getApiUrl(getAvroGateway({
    auth,
    na1Only,
    timeout: clientTimeout,
    isRoutedGlobally: routingLocality === 'GLOBAL'
  }), undefined, undefined, getBaseUrlForAuth(auth))}`;
  const endpointUrl = `${endpointUrlBase}/${serviceName}/${rpcName}`;
  const internalAuthToken = auth === 'internal' ? getInternalAuthToken() : null;
  const extraHeaders = [{
    header: 'x-hs-fingerprint',
    value: fingerprint
  }, ...(internalAuthToken ? [{
    header: 'Authorization',
    value: `Bearer ${internalAuthToken}`
  }] : [])];
  return new Promise((resolve, reject) => {
    quickFetch.makeEarlyRequest(requestName, {
      type: 'POST',
      data: JSON.stringify(request !== null && request !== void 0 ? request : {}),
      extraHeaders,
      url: endpointUrl,
      timeout: clientTimeout,
      noAuth: auth === 'external' || auth === 'internal',
      whenFinished: response => {
        try {
          const parsed = JSON.parse(response);
          const result = parseRejectingChirpErrors(parsed, serviceName);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      },
      onError: (xhr, errorMessage) => {
        if (!xhr.responseText) {
          reject(new Error(errorMessage));
          return;
        }
        try {
          const parsed = JSON.parse(xhr.responseText);
          parseRejectingChirpErrors(parsed, serviceName);
          // parseRejectingChirpErrors always throws for known CHIRP error types.
          // If we reach here, it was valid JSON but not a CHIRP shape.
          reject(new Error(errorMessage));
        } catch (e) {
          reject(e);
        }
      }
    });
  });
};
export const getChirpEarlyRequestName = (details, inputs) => {
  var _inputs$request;
  const request = (_inputs$request = inputs === null || inputs === void 0 ? void 0 : inputs.request) !== null && _inputs$request !== void 0 ? _inputs$request : {};
  return createRequestName(details, request);
};
export const getChirpEarlyRequest = ({
  details,
  requestObject,
  name
}) => {
  var _requestObject$reques;
  const request = (_requestObject$reques = requestObject === null || requestObject === void 0 ? void 0 : requestObject.request) !== null && _requestObject$reques !== void 0 ? _requestObject$reques : {};
  const requestName = name !== null && name !== void 0 ? name : createRequestName(details, request);
  const requestState = quickFetch.getRequestStateByName(requestName);
  if (requestState && !requestState.error) {
    return new Promise((resolve, reject) => {
      requestState.whenFinished(response => {
        quickFetch.removeEarlyRequest(requestName);
        // Quick fetch responses are always strings
        resolve(JSON.parse(response));
      });
      requestState.onError((xhr, errorMessage) => {
        quickFetch.removeEarlyRequest(requestName);
        try {
          const parsed = JSON.parse(xhr.responseText);
          if (typeof parsed === 'object' && (parsed.type === 'rpcError' || parsed.type === 'internalError')) {
            resolve(parsed);
          } else {
            reject(errorMessage);
          }
        } catch (e) {
          reject(errorMessage);
        }
      });
    });
  }
  return undefined;
};