'use es6';

import {
    responseHandlers,
    responseError
} from '../helpers/response';
import {
    set
} from '../helpers/update';

// Only importing via wildcard for unit test's sake
import * as requestTracker from '../helpers/requestTracker';

// Timeout padding for Network Round Trip Time (RTT)
const RTT_PADDING_MS = 500;
export const handleResponse = (response, handlers) => {
    return handlers.reduce((previous, handler) => handler(previous), response);
};
export const getResponseHeaders = xhr => (xhr.getAllResponseHeaders() || '').trim().split('\n').reduce((headers, current) => {
    const split = current.trim().split(':');
    const key = split.shift().trim();
    const value = split.join(':').trim();
    headers[key] = value;
    return headers;
}, {});
export const withResponseHandlers = (response, options) => {
    response = set('options', options)(response);
    const handlers = responseHandlers(options);
    return handlers && handlers.length ? handleResponse(Promise.resolve(response), handlers) : Promise.resolve(response);
};
const getJSONResponse = xhr => {
    try {
        return xhr.getResponseHeader('content-type').indexOf('application/json') === 0 ? JSON.parse(xhr.responseText) : undefined;
    } catch (err) {
        return undefined;
    }
};
export const buildResponse = xhr => ({
    status: xhr.status,
    statusText: xhr.statusText,
    data: 'response' in xhr ? xhr.response : xhr.responseText,
    headers: getResponseHeaders(xhr),
    xhr,
    responseText: xhr.responseType === 'text' || xhr.responseType === '' ? xhr.responseText : '',
    responseJSON: getJSONResponse(xhr)
});

// create an error with XHR and response information.
export const buildErrorResponse = (xhr, message, code) => {
    const response = buildResponse(xhr);
    return Object.assign(response, {
        statusText: response.statusText || message,
        responseJSON: getJSONResponse(xhr),
        errorMessage: message,
        errorCode: code
    });
};
export const buildRequestError = reason => {
    let error;
    const errorCode = 'REQUEST ERROR';
    if (reason instanceof Error) {
        error = reason;
    } else if (typeof reason === 'string' || reason instanceof String) {
        error = new Error(reason);
    }
    return Object.assign(error, {
        code: errorCode,
        status: 0,
        statusText: error.message
    });
};
export const requestIdKey = Symbol('requestId');
export const withTracking = options => {
    if (options.doNotTrack === true) {
        return options;
    } else {
        const requestId = requestTracker.startTrackingRequest(options.url, 'hub-http');
        const optionsClone = Object.assign({}, options);
        optionsClone[requestIdKey] = requestId;
        return optionsClone;
    }
};
export const trackFailureBasedOnErrorResponse = (response, {
    willBeRetried = false,
    retryReason,
    retryAttempt
} = {}) => {
    if (response.options && response.options[requestIdKey] !== undefined) {
        if (response.errorCode === 'ABORT') {
            requestTracker.finishTrackingRequest(response.options[requestIdKey], response.options.url, 'aborted', {
                status: response.status
            });
        } else if (response.errorCode === 'TIMEOUT') {
            requestTracker.finishTrackingRequest(response.options[requestIdKey], response.options.url, 'timedOut', {
                status: response.status
            });
        } else {
            requestTracker.finishTrackingRequest(response.options[requestIdKey], response.options.url, 'failed', {
                status: response.status,
                statusText: response.statusText,
                willBeRetried,
                retryReason,
                retryAttempt
            });
        }
    }
    return response;
};
export const withRetry = (options, fn) => {
    const attempt = options.retryAttempts || 0;
    return fn(Object.assign({}, options, {
        retryAttempts: attempt
    })).catch(response => {
        if (response.retry && response.retry.exceededRetries) {
            return Promise.reject(responseError(response, `Request for ${response.options.method} ${response.options.url} failed with status code ${response.status} after max retries exceeded (${response.retry.maxRetries}). ${response.statusText || ''}`));
        } else if (response.retry) {
            const reasonMessage = response.retry.reason ? ` Reason: ${response.retry.reason}` : '';

            // Try retries (the final attempt will not have `response.retry` and will be tracked
            // by the normal handlers)
            trackFailureBasedOnErrorResponse(response, {
                willBeRetried: true,
                retryReason: reasonMessage,
                retryAttempt: attempt + 1
            });

            // eslint-disable-next-line no-console
            console.log(`Retrying. Retry attempt ${attempt + 1} of ${response.retry.maxRetries}.${reasonMessage}`);
            return new Promise(resolve => {
                setTimeout(() => resolve(withRetry(Object.assign({}, options, {
                    retryAttempts: attempt + 1,
                    // Clear dispatchTime on retry. We'll have already logged the time until
                    // the request was first dispatched, which is the metric we care about.
                    _dispatchTime: undefined
                }), fn)), response.retry.delay);
            });
        }

        // Just in case some other rejection/error comes through unrelated to retries
        return Promise.reject(response);
    });
};
export const trackSuccess = response => {
    if (response.options && response.options[requestIdKey] !== undefined) {
        requestTracker.finishTrackingRequest(response.options[requestIdKey], response.options.url, 'succeeded', {
            status: response.status,
            statusText: response.statusText
        });
    }
    return response;
};
export const resolveTimeout = timeout => {
    // Only apply round-trip time padding for non-zero timeout values
    // timeout of 0 means no timeout. allow explicitly disabled timeouts
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout
    if (typeof timeout === 'number' && timeout > 0) {
        return timeout + RTT_PADDING_MS;
    }
    return timeout;
};