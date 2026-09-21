'use es6';

import Env from 'enviro';
import {
    createStack
} from '../index';
import {
    set,
    setIf,
    setIn
} from '../helpers/update';
import {
    handleResponse,
    responseError
} from '../helpers/response';
import {
    parseUrl,
    buildUrl,
    parseHostname
} from '../helpers/url';
import * as params from '../helpers/params';
import * as headers from '../helpers/headers';
import {
    isAuthMocked
} from '../helpers/authMocked';
import {
    maybeGetParentIframe,
    notifyParentAndRejectOnStatuses,
    MIGRATION_IN_PROGRESS_MESSAGE,
    PORTAL_MOVED_MESSAGE
} from '../helpers/iframe';
import {
    redirectTo
} from '../helpers/location';
import {
    getAppInfo
} from '../helpers/appInfo';
import {
    getHsLocale
} from 'hs-locale-management';

// defensive over accessing localStorage because http://meyerweb.com/eric/thoughts/2012/04/25/firefox-failing-localstorage/
const getLocalStorage = () => {
    try {
        return window.localStorage;
    } catch (error) {
        return undefined;
    }
};
export const withHsLocaleHeader = options => {
    try {
        const locale = options.localStorage && options.localStorage.getItem('hs_locale');
        return locale ? headers.setHeader('X-HS-Locale', locale, options) : options;
    } catch (e) {
        return options;
    }
};
export const services = options => {
    const baseOptions = Object.assign({
        location: window.location,
        cookies: window.document.cookie,
        localStorage: getLocalStorage(),
        document: window.document,
        appInfo: getAppInfo()
    }, options);
    const locale = getHsLocale();
    return locale ? headers.setHeader('X-HS-Locale', locale, baseOptions) : baseOptions;
};
export const validateOptions = (validator, errorMessage) => options => {
    if (!validator || typeof validator !== 'function') {
        throw new Error('validator must be a function');
    }
    if (!validator(options)) throw new Error(errorMessage);
    return options;
};
export const resolveApi = api => {
    const environment = Env.getShort('hub-http');
    const location = environment === 'local' ? 'local' : 'deployed';
    const hostname = api[location] ? api[location][environment] : null;
    if (!hostname) {
        throw new Error(`No hostname defined for environment ${environment} and ${location}`);
    }
    return hostname;
};
const parsedUrl = Symbol('url');

// ensures consistant handling of the parsed url object when making url modifications
// without losing information
export const withUrl = urlMutator => options => {
    let descriptor = options[parsedUrl] || parseUrl(options.url);
    descriptor = urlMutator(descriptor);
    options = set(parsedUrl, descriptor)(options);
    options = set('url', buildUrl(descriptor))(options);
    return options;
};
export const withOptions = (options, newOptions) => {
    return Object.assign({}, options, newOptions);
};

// TODO: REVIEW
const fromInput = (propertyName, options) => {
    /**
     * If options.input exists, this is a composed middleware's options, and we want to check if
     * the initial arguments had the property name. Otherwise, there's only one middleware
     * current options === initial options.
     */
    const input = options && options._input ? options._input : options;
    return input[propertyName] !== undefined ? input[propertyName] : undefined;
};
export const defaultTo = (propertyName, value) => options => fromInput(propertyName, options) === undefined ? set(propertyName, value)(options) : options;
export const method = verb => defaultTo('method', verb);
export const header = (name, value, override) => options => {
    return override || headers.getHeader(name, options) === undefined ? headers.setHeader(name, value, options) : options;
};
export const base = baseUrl => options => set('url', baseUrl + options.url)(options);
const initialQuery = Symbol('initialQuery');
const notOverridableQuery = Symbol('noOverrideQuery');
const overridableQuery = Symbol('overrideQuery');
export const query = (obj, allowOverride = true) => {
    return withUrl(url => {
        let descriptor = url;
        if (typeof descriptor[initialQuery] === 'undefined') {
            descriptor = set(initialQuery, url.query || '')(descriptor);
        }
        const [key, baseObj, superset] = allowOverride ? [overridableQuery, descriptor[overridableQuery], obj] : [notOverridableQuery, obj, descriptor[notOverridableQuery]];
        descriptor = setIn([key], Object.assign({}, baseObj, superset))(descriptor);
        return set('query', [descriptor[initialQuery], params.stringify(Object.assign({}, descriptor[overridableQuery], descriptor[notOverridableQuery]))].filter(Boolean).join('&'))(descriptor);
    });
};
export const withQuery = options => query(options.query, false)(options);
export const httpsOnly = withUrl(set('protocol', 'https'));
export const environmentUrl = defaultApi => options => withUrl(url => {
    if (!url.protocol && options.location) {
        url.protocol = options.location.protocol.slice(0, -1);
    }
    if (!url.hostname) {
        const api = options.api || defaultApi;
        url.hostname = resolveApi(api);
    }
    return url;
})(options);
export const withApiAsOption = options => {
    if (!options.api) {
        throw new Error('Missing api option. Expected api object (you can create one with the hubletApi function');
    }
    return environmentUrl(null)(options);
};
export const hubletSubdomainPostfix = (hubletOverride, hubletizeNa1 = false) => {
    const currHublet = hubletOverride || Env.getHublet();
    return Env.ifHublet({
        isNa1: hublet => hubletizeNa1 ? `-${hublet}` : '',
        isNonNa1: hublet => `-${hublet}`
    }, currHublet);
};
export const hubletApi = (name, domainPrefix, hubletOverride, hubletizeNa1 = false) => {
    const targetHublet = hubletSubdomainPostfix(hubletOverride, hubletizeNa1);
    return {
        local: {
            qa: `local${targetHublet}.${domainPrefix}qa.com`,
            prod: `local${targetHublet}.${domainPrefix}.com`
        },
        deployed: {
            qa: `${name}${targetHublet}.${domainPrefix}qa.com`,
            prod: `${name}${targetHublet}.${domainPrefix}.com`
        }
    };
};
export const bodyType = (contentType, stringifyFn) => options => {
    options = header('content-type', contentType)(options);
    if (options.rawData) {
        options.data = options.rawData;
    } else if (typeof stringifyFn === 'function' && headers.getHeader('content-type', options) === contentType) {
        options.data = stringifyFn(options.data);
    }
    return options;
};
export const jsonBody = options =>
    // null will stringify to "null", whereas undefined will stringify to ""
    // (a body with content-length: 0), which is invalid json.
    options.data !== undefined || options.rawData !== undefined ? bodyType('application/json', JSON.stringify)(options) : options;
const wrapResponseHandler = handler => response => {
    try {
        return handler(response);
    } catch (error) {
        error.response = response;
        throw error;
    }
};
export const onResponse = handler => handleResponse(response => response.then(wrapResponseHandler(handler)));
export const onResponseError = handler => handleResponse(response => response.catch(wrapResponseHandler(handler)));
export const responseInterceptor = (handler, alwaysRejectOnCatch = true) => handleResponse(response => response.then(wrapResponseHandler(handler), r => alwaysRejectOnCatch ? Promise.reject(handler(r)) : handler(r)));
const getContentType = response => {
    if (!response || !response.headers) return '';
    return headers.getHeader('content-type', response) || '';
};
export const jsonResponse = createStack(header('Accept', 'application/json, text/javascript, */*; q=0.01'), onResponse(response => setIf(typeof response.data === 'string' && getContentType(response).indexOf('application/json') === 0, 'data', () => response.data.length ? JSON.parse(response.data) : undefined)(response)));
export const reportOptionsError = onResponse(response => {
    if (response.errorCode === 'OPTIONSERROR') {
        return Promise.reject(responseError(response, `hub-http error building request options: ${response.options.error.message}`));
    }
    return response;
});
const addQueryParamToResponseError = (response, url) => {
    const error = responseError(response, `Request for ${url.split('?')[0]} failed with status ${response.status}. ${response.statusText || ''}`);
    error._hsAdditionalProperties = {
        queryParamsString: url.split('?')[1]
    };
    return error;
};
export const validateStatus = options => onResponse(response => response.status >= 200 && response.status < 300 ? response : Promise.reject(addQueryParamToResponseError(response, options.url)))(options);
export const retry = (predicate, {
    reason,
    maxRetries = 1,
    delay = 250,
    onMaxAttemptsReached
} = {}) => options => {
    const interceptor = response => {
        if (predicate(response)) {
            const responseWithRetryInfo = set('retry', {
                reason,
                maxRetries,
                delay,
                exceededRetries: response.options.retryAttempts >= maxRetries
            })(response);
            return Promise.reject(responseError(responseWithRetryInfo, `Request for ${options.url} failed with status ${response.status}. ${response.statusText || ''}`));
        }
        return response;
    };
    if (maxRetries === 0) {
        // Make the retry middleware a no-op
        return options;
    } else {
        // Intercept the current response to do retries
        const responseMiddleware = options.retryAttempts >= maxRetries && typeof onMaxAttemptsReached === 'function' ? createStack(onResponse(interceptor), onMaxAttemptsReached) : onResponse(interceptor);
        return responseMiddleware(options);
    }
};
export const safeMode = set('safeMode', true);
export const redirectOn = (predicate, redirectLocation) => options => onResponse(response => {
    if (predicate(response)) {
        let redirectLocationString;
        try {
            if (typeof redirectLocation === 'function') {
                redirectLocationString = redirectLocation(response);
            } else {
                redirectLocationString = redirectLocation;
            }
            redirectTo(redirectLocationString, response.options);
            return Promise.reject(responseError(response, 'Aborting: redirection in progress'));
        } catch (__error) {
            return Promise.reject(responseError(response, 'Aborting: status indicates redirect required, but redirect URL could not be formed'));
        }
    }
    return response;
})(options);
export const redirectOnMigrationInProgress = options => {
    if (options.skipMigrationCheck || isAuthMocked(options)) {
        return options;
    }
    const parentWindow = maybeGetParentIframe();
    if (parentWindow) {
        return notifyParentAndRejectOnStatuses([477], parentWindow, MIGRATION_IN_PROGRESS_MESSAGE)(options);
    }
    return redirectOn(response => response.status === 477, buildUrl({
        hostname: resolveApi(hubletApi('app', 'hubspot')),
        path: `/data-transfer-status/${options.portalId}/`
    }))(options);
};
export const redirectOnPortalMoved = options => {
    if (isAuthMocked(options)) {
        return options;
    }
    const parentWindow = maybeGetParentIframe();
    if (parentWindow) {
        return notifyParentAndRejectOnStatuses([488], parentWindow, PORTAL_MOVED_MESSAGE)(options);
    }
    return redirectOn(response => response.status === 488, response => {
        const correctHublet = headers.getHeader('x-hubspot-correct-hublet', response);
        if (!correctHublet) {
            throw new Error('488 response missing X-Hubspot-Correct-Hublet header');
        }
        const location = options.location;
        return buildUrl({
            // a UrlDescriptor and a Location have totally different shapes and rules.
            protocol: location.protocol && location.protocol.endsWith(':') ? location.protocol.slice(0, -1) : location.protocol,
            port: location.port,
            path: location.pathname,
            query: location.search !== '' ? location.search.substring(1) : undefined,
            hash: location.hash !== '' ? location.hash.substring(1) : undefined,
            hostname: resolveApi(hubletApi(parseHostname(options.location).loadBalancerBase || 'app', 'hubspot', correctHublet))
        });
    })(options);
};
export const enableMigrationCheckBypass = options => {
    if (isAuthMocked(options)) {
        return options;
    }
    return query({
        skipMigrationCheck: options.skipMigrationCheck
    }, false)(options);
};
export const timeoutInQuery = options => !isAuthMocked(options) && typeof options.timeout === 'number' ? query({
    clienttimeout: options.timeout
})(options) : options;