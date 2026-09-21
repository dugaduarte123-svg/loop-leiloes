'use es6';

import Env from 'enviro';
import {
    parseUrl
} from '../helpers/url';
import * as params from '../helpers/params';
import {
    query,
    header
} from './core';
import {
    logoutOn
} from './hubapi';
import {
    createStack
} from '../index';
import {
    getCookie
} from '../helpers/cookies';
import {
    isAuthMocked
} from '../helpers/authMocked';
import {
    logoutOnMissingPortalId
} from './hubapi';
export const ensureHttps = options => {
    if (!Env.deployed('hub-http') && options.location.protocol !== 'https:') {
        const message = 'Cookie authentication require apps to be on https';

        // eslint-disable-next-line no-console
        console.error('[hub-http]', message);
        throw new Error(message);
    }
    return options;
};
export const logoutOnMissingCsrf = options => logoutOn(() => !getCookie(options.csrfCookieName, options.cookies))(options);
export const withCsrf = options => {
    return header('X-HubSpot-CSRF-hubspotapi', getCookie(options.csrfCookieName, options.cookies))(options);
};
export const ensurePortalId = options => {
    const parsed = parseUrl(options.url);
    if (!params.parse(parsed.query).portalId) {
        return createStack(logoutOnMissingPortalId, query({
            portalId: options.portalId
        }))(options);
    }
    return options;
};
const cookieAuthStack = createStack(logoutOnMissingCsrf, withCsrf, options => options.allowMissingPortalId ? options : ensurePortalId(options));
export const allowMissingPortalId = options => Object.assign({
    allowMissingPortalId: true
}, options);
export const cookieAuthentication = config => options => {
    if (isAuthMocked(options)) {
        return options;
    }
    const domainsConfig = config;
    const domain = parseUrl(options.url).hostname;
    const configForDomain = domainsConfig.find(dc => dc.matcher.test(domain));
    return cookieAuthStack(Object.assign({}, options, {
        csrfCookieName: configForDomain.csrfCookieName
    }));
};