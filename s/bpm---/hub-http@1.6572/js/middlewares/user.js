'use es6';

import {
    createStack
} from '../index';
import {
    set
} from '../helpers/update';
import {
    retry,
    onResponse,
    hubletApi,
    resolveApi,
    withUrl,
    method,
    environmentUrl,
    query
} from './core';
import {
    logoutOn,
    logoutOnErrorWithReason
} from './hubapi';
import {
    lab
} from './lab';
import {
    buildUrl
} from '../helpers/url';
import {
    redirectTo
} from '../helpers/location';
import {
    responseError
} from '../helpers/response';
import toggleable from '../decorators/toggleable';
import {
    maybeAddApiPathPrefix
} from './hubapi';
import {
    maybeGetParentIframe,
    notifyParentAndRejectOnStatuses,
    UNAUTHORIZED_MESSAGE
} from '../helpers/iframe';
const recycledResponse = response => response.xhr.readyState === 0 ? {
    status: response.status,
    statusText: response.statusText,
    data: response.data
} : response.xhr;
const withRecycledResponse = options => response => set('externalResponse', recycledResponse(response))(options);
export const recyclePromise = options => {
    if (options.recycledPromise) {
        return options.recycledPromise.then(withRecycledResponse(options), withRecycledResponse(options));
    } else {
        return options;
    }
};
const isUnauthorizedOrForbidden = response => response.status === 403 || response.status === 401;
export const logoutOnUnauthorizedOrForbidden = options => {
    const parentWindow = maybeGetParentIframe();
    if (parentWindow) {
        return notifyParentAndRejectOnStatuses([401, 403], parentWindow, UNAUTHORIZED_MESSAGE)(options);
    }
    return logoutOn(isUnauthorizedOrForbidden)(options);
};
export const retryOnError = retry(response => response.status !== 200 && !isUnauthorizedOrForbidden(response), {
    reason: 'Error fetching user data',
    maxRetries: 3,
    onMaxAttemptsReached: logoutOnErrorWithReason('transient_error')
});
export const portalIdBody = options => set('data', {
    portalId: options.portalId
})(options);
const buildForbiddenUrl = options => {
    const hostname = resolveApi(hubletApi('app', 'hubspot'));
    const portalId = options.portalId || '';
    const dashboardDescriptor = {
        hostname,
        path: `/account-and-billing/${portalId}/forbidden`
    };
    return buildUrl(dashboardDescriptor);
};
const redirectSuspendedHub = response => {
    const options = response.options;
    const redirectUrl = buildForbiddenUrl(options);
    return redirectTo(redirectUrl, options) ? Promise.reject(responseError(response, 'Aborting: redirection in progress')) : response;
};
export const shouldRedirectForSuspension = response => !!response.options && !response.options.allowSuspended && !!response.data && !!response.data.user && Array.isArray(response.data.user.scopes) && response.data.user.scopes.indexOf('suspended') !== -1;
export const hubUserInfoEndpointTest = createStack(options => withUrl(url => {
    if (url.path === '/login-verify') {
        return Object.assign({}, url, {
            path: '/login-verify/hub-user-info'
        });
    }
    return url;
})(options), method('GET'), options => lab('HUBONEDOMAIN', maybeAddApiPathPrefix(environmentUrl(hubletApi('app', 'hubspot', options.hubletOverride))), environmentUrl(hubletApi('api', 'hubspot', options.hubletOverride)))(options), options => query({
    portalId: options.portalId
})(options));
export const redirectSuspendedUsers = toggleable(isEnabled => options => {
    if (!isEnabled()) return options;
    return onResponse(response => {
        if (shouldRedirectForSuspension(response)) {
            return redirectSuspendedHub(response);
        }
        return response;
    })(options);
});