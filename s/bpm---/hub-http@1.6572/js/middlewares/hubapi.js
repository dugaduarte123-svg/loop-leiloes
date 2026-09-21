'use es6';

import {
    stringify
} from '../helpers/params';
import {
    buildUrl,
    parseUrl
} from '../helpers/url';
import {
    environmentUrl,
    hubletApi,
    hubletSubdomainPostfix,
    onResponse,
    onResponseError,
    resolveApi,
    retry,
    withUrl,
    timeoutInQuery
} from './core';
import {
    lab
} from './lab';
import {
    maybeGetParentIframe,
    notifyParentAndRejectOnStatuses,
    UNAUTHORIZED_MESSAGE
} from '../helpers/iframe';
import {
    responseError
} from '../helpers/response';
import {
    redirectTo
} from '../helpers/location';
import authCache from '../helpers/authCache';
import {
    clearHsLocale
} from 'hs-locale-management';
import {
    set
} from '../helpers/update';
import {
    isAuthMocked
} from '../helpers/authMocked';
import {
    getHeader
} from '../helpers/headers';

/**
 * @deprecated Please import `timeoutInQuery` from `hub-http/middlewares/core` instead.
 */
export {
    timeoutInQuery
};
export const defaults = options => Object.assign({}, {
    timeout: 14000,
    withCredentials: true,
    portalId: window.hubspot && window.hubspot.portal && window.hubspot.portal.id,
    labs: window.hubspot && window.hubspot['__hub-http-labs']
}, options);
export const maybeAddApiPathPrefix = middleware => options => middleware(withUrl(url => {
    // If someone has passed a full url or is passing their own API option we won't modify it.
    if (url.hostname || options.api) {
        return url;
    }
    let path = url.path;
    if (path.startsWith('/api/') || path.startsWith('api/')) {
        return url;
    } else if (path.startsWith('/')) {
        path = `/api${path}`;
    } else {
        path = `/api/${path}`;
    }
    url.path = path;
    return url;
})(options));
export const hubapi = lab('HUBONEDOMAIN', maybeAddApiPathPrefix(environmentUrl(hubletApi('app', 'hubspot'))), environmentUrl(hubletApi('api', 'hubspot')));
export const maybeUseIframeRequest = options => {
    if (isAuthMocked(options)) {
        return options;
    }
    const {
        hostname
    } = parseUrl(options.url);
    const useIframeRequest = hostname.indexOf(`api${hubletSubdomainPostfix()}.hubspot`) === 0;
    return set('useIframeRequest', useIframeRequest)(options);
};
export const setRequest = maybeUseIframeRequest;
const buildLogoutUrl = (options, headers, reasonOverride) => {
    const hostname = resolveApi(hubletApi('app', 'hubspot'));
    const loginDescriptor = {
        hostname,
        path: options.loginPathOverride || '/login/'
    };
    const loginQuery = {
        loginRedirectUrl: options.location.href
    };
    const failureReason = reasonOverride || headers && headers['x-hubspot-auth-failure'];
    if (failureReason) {
        Object.assign(loginQuery, {
            authFailureReason: failureReason
        });
    }
    if (options.portalId) {
        loginQuery.loginPortalId = options.portalId;
    }
    loginDescriptor.query = stringify(loginQuery);
    return buildUrl(loginDescriptor);
};
const onRedirectToLogin = options => {
    authCache.clear(options);
    clearHsLocale();
};
const handleLogoutFromRequest = options => {
    const redirectUrl = buildLogoutUrl(options);
    if (redirectTo(redirectUrl, options, onRedirectToLogin)) {
        throw new Error('Aborting: redirection in progress');
    }
    return options;
};
const handleLogoutFromResponse = response => {
    const options = response.options;
    const redirectUrl = buildLogoutUrl(options, response.headers);
    redirectTo(redirectUrl, options, onRedirectToLogin);
    return Promise.reject(responseError(response, 'Aborting: redirection in progress'));
};
export const logoutOnError = onResponseError(handleLogoutFromResponse);
export const logoutOnErrorWithReason = reason => onResponseError(response => {
    const redirectUrl = buildLogoutUrl(response.options, response.headers, reason);
    redirectTo(redirectUrl, response.options, onRedirectToLogin);
    return Promise.reject(responseError(response, 'Aborting: redirection in progress'));
});
export const logoutOn = predicate => options => onResponse(response => {
    if (predicate(response)) {
        return handleLogoutFromResponse(response);
    }
    return response;
})(options);
const isUnauthorizedAndAuthFailure = response => response.status === 401 && !!getHeader('x-hubspot-auth-failure', response);
export const logoutOnUnauthorized = options => {
    if (isAuthMocked(options)) {
        return options;
    }
    const parentWindow = maybeGetParentIframe();
    if (parentWindow) {
        return notifyParentAndRejectOnStatuses([401], parentWindow, UNAUTHORIZED_MESSAGE)(options);
    }
    return logoutOn(isUnauthorizedAndAuthFailure)(options);
};
export const logoutOnMissingPortalId = options => {
    if (!options.portalId) {
        // eslint-disable-next-line no-console
        console.log('[hub-http] Could not find portal id. Redirecting');
        return handleLogoutFromRequest(options);
    }
    return options;
};
export const retryOnError = retry(response => response.options.method === 'GET' && (response.status >= 500 || response.status === 0 && response.errorCode === 'NETWORKERROR'), {
    reason: 'Server error'
});