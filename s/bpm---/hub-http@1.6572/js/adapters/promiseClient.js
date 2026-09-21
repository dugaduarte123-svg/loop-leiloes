'use es6';

import {
    set
} from '../helpers/update';
import {
    withResponseHandlers,
    buildResponse,
    buildErrorResponse,
    withRetry,
    withTracking,
    trackSuccess,
    trackFailureBasedOnErrorResponse,
    buildRequestError,
    resolveTimeout
} from './adapterUtils';
import {
    withStaticAppInfo,
    ensureStaticAppInfo,
    ensureSeleniumParam
} from '../middlewares/staticAppInfo';
import {
    setMockAuth
} from '../middlewares/mockAuth';
import {
    createStack
} from '../index';
import {
    reportDomain,
    reportStatusCode as _reportStatusCode
} from '../tracking/trackRequests';
import {
    Metrics
} from '../tracking/metrics';
import {
    parseUrl
} from '../helpers/url';
import {
    enableMockAuth as _enableMockAuth
} from '../internal/authMocked';
import {
    isAuthMocked
} from '../helpers/authMocked';

/**
 * HubSpot's backend stack uses the `clienttimeout` that we set in query params
 * via the `timeoutInQuery` middleware to set a server-side deadline for the
 * request thread: https://git.hubteam.com/HubSpot/bootstrap/blob/f401d5284321d50fb3b9e829ba364fe86e2814e9/bootstrap-rest-parent/bootstrap-rest-shared/src/main/java/com/hubspot/bootstrap/rest/jersey/filters/DeadlineHandler.java#L35-L46
 * This allows Java services to abort expensive operations if insufficient time
 * remains to complete the work.
 *
 * However, using the same duration client-side does not account for the
 * the server using 100% of the alotted time. High network latency can time out
 * the request even if the server attempted to return a successful response
 * within the timeout window.
 *
 * Any round trip network latency above 500ms is likely too slow to load the
 * app anyway, and probably will far exceed the set timeout regardless.
 */

export const maybeWithIframeXMLHttpRequest = options => {
    const canUseSyncIframeRequest = options.useIframeRequest && window.iframeXMLHttpRequest && window.apiIframe && window.apiIframe.contentDocument;
    const canUseAsyncIframeRequest = options.useIframeRequest && window.iframeXMLHttpRequestPromise;
    const canUseIframeHack = canUseSyncIframeRequest || canUseAsyncIframeRequest;
    if (!canUseIframeHack) {
        return set('Request', options.Request || XMLHttpRequest)(options);
    }

    // see https://git.hubteam.com/HubSpot/hub-http/pull/372
    window.apiIframeUsed = true;
    const newHeaders = Object.assign({
        'X-HS-Referer': window.location.href
    }, options.headers);
    const optionsWithAdditionalHeaders = withStaticAppInfo(set('headers', newHeaders)(options));

    // If iframeXMLHttpRequestPromise is set, wait for it to resolve before issuing a request
    // This is done when all appropriate requests must be sent via the frame
    if (canUseAsyncIframeRequest) {
        return window.iframeXMLHttpRequestPromise.then(iframeXMLHttpRequest => set('Request', iframeXMLHttpRequest)(optionsWithAdditionalHeaders)).catch(() => set('Request', options.Request || XMLHttpRequest)(options));
    }
    return set('Request', window.iframeXMLHttpRequest)(optionsWithAdditionalHeaders);
};
const withOptions = options => {
    const authMocked = isAuthMocked(options);
    // We don't want to track requests during tests
    const reportStatusCode = authMocked ? () => {} : _reportStatusCode;
    return new Promise(resolve => {
        const Request = options.Request || XMLHttpRequest;
        const xhr = new Request();
        if (options.error) {
            resolve(withResponseHandlers(buildErrorResponse(xhr, options.error.message, 'OPTIONSERROR'), options));
            return;
        }

        // the http request was done by a separate client and is being piped back
        // into this one for response handling.
        if (options.externalResponse) {
            // eslint-disable-next-line no-console
            const fromExternalResponse = options.externalResponse instanceof XMLHttpRequest ? buildResponse(options.externalResponse) : Object.assign(buildResponse(xhr), options.externalResponse);
            resolve(withResponseHandlers(fromExternalResponse, options));
            return;
        }
        reportDomain(options.url);
        xhr.open(options.method || 'GET', options.url, true);
        xhr.timeout = resolveTimeout(options.timeout);
        xhr.withCredentials = options.withCredentials;
        if (options.responseType) {
            xhr.responseType = options.responseType;
        }
        if (typeof options.withXhr === 'function') {
            options.withXhr(xhr);
        }
        Object.keys(options.headers || {}).forEach(headerName => {
            if (options.headers[headerName] !== false) {
                xhr.setRequestHeader(headerName, options.headers[headerName]);
            }
        });
        const sendTime = performance.now();
        if (options._dispatchTime) {
            Metrics.histogram('hub-http-request-middleware-delay').update(sendTime - options._dispatchTime);
        }
        xhr.addEventListener('load', () => {
            reportStatusCode({
                url: xhr.responseURL,
                sendTime,
                statusCode: xhr.status
            });
            return resolve(withResponseHandlers(buildResponse(xhr), options));
        });
        xhr.addEventListener('error', () => {
            reportStatusCode({
                url: xhr.responseURL || options.url,
                sendTime,
                statusCode: xhr.status,
                statusDesc: 'NETWORKERROR'
            });
            return resolve(withResponseHandlers(buildErrorResponse(xhr, 'Network request failed', 'NETWORKERROR'), options));
        });
        xhr.addEventListener('timeout', () => {
            reportStatusCode({
                url: xhr.responseURL || options.url,
                sendTime,
                statusCode: xhr.status,
                statusDesc: 'TIMEOUT'
            });
            return resolve(withResponseHandlers(buildErrorResponse(xhr, 'Request timeout', 'TIMEOUT'), options));
        });
        xhr.addEventListener('abort', () => {
            reportStatusCode({
                url: xhr.responseURL || options.url,
                sendTime,
                statusCode: xhr.status,
                statusDesc: 'ABORT'
            });
            return resolve(withResponseHandlers(buildErrorResponse(xhr, 'Request aborted', 'ABORT'), options));
        });
        xhr.send(typeof options.data === 'undefined' ? null : options.data);
    });
};
const handleRequestErrors = reason => Promise.reject(buildRequestError(reason));
const essentialMiddleware = createStack(withTracking, maybeWithIframeXMLHttpRequest, ensureStaticAppInfo, ensureSeleniumParam);
export let _originalClientImplCalled = false;
const createClientImpl = optionMiddleware => {
    _originalClientImplCalled = true;
    const client = (url, options) => {
        const dispatchTime = performance.now();
        // Only track dispatch time if the request was made within 20s of pageload
        const _dispatchTime = dispatchTime < 20000 ? dispatchTime : undefined;
        const parsed = parseUrl(url);
        if (parsed.hostname && parsed.hostname.match(/^api(-[a-z]{2}\d{1})?\.hubspot(qa)?\.com/)) {
            Metrics.counter('hardcoded-api-hubspot-domain').increment();
        }
        return withRetry(Object.assign({}, options, {
            url,
            _dispatchTime
        }), o => optionMiddleware(o).catch(handleRequestErrors).then(essentialMiddleware).then(withOptions)).then(trackSuccess, response => Promise.reject(trackFailureBasedOnErrorResponse(response)));
    };
    const responseWithMethod = method => (url, options) => client(url, Object.assign({}, options, {
        method
    }));
    const withMethod = method => (url, options) => responseWithMethod(method)(url, options).then(({
        data
    }) => data);
    return Object.assign(client, {
        get: withMethod('GET'),
        post: withMethod('POST'),
        put: withMethod('PUT'),
        patch: withMethod('PATCH'),
        delete: withMethod('DELETE'),
        options: withMethod('OPTIONS'),
        getWithResponse: responseWithMethod('GET'),
        postWithResponse: responseWithMethod('POST'),
        putWithResponse: responseWithMethod('PUT'),
        patchWithResponse: responseWithMethod('PATCH'),
        deleteWithResponse: responseWithMethod('DELETE'),
        optionsWithResponse: responseWithMethod('OPTIONS')
    });
};

/**
 * Should only be invoked by the fe test runner
 *
 * TODO: Can be removed once `hub-http-rxjs` usage is migrated to `hub-http/helpers/authMocked`
 *
 * @deprecated
 */
export const enableMockAuth = () => {
    return _enableMockAuth();
};
export default (optionMiddleware => createClientImpl(createStack(setMockAuth(isAuthMocked()), optionMiddleware)));