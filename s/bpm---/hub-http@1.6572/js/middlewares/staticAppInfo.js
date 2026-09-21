'use es6';

import {
    query,
    header
} from './core';
import {
    parseUrl
} from '../helpers/url';
import * as params from '../helpers/params';
import {
    getCookie
} from '../helpers/cookies';
const formatVersion = version => {
    if (version == null) {
        return 'unknown';
    }
    if (version === 'static') {
        return 'dev';
    }
    return version.replace('static-', '');
};
export const withStaticAppInfo = options => options.appInfo ? header('X-HubSpot-Static-App-Info', `${options.appInfo.name}@${formatVersion(options.appInfo.version)}`)(options) : options;
export const ensureStaticAppInfo = options => {
    if (!options.appInfo) return options;
    const queries = params.parse(parseUrl(options.url).query);
    return query({
        hs_static_app: queries.hs_static_app || options.appInfo.name,
        hs_static_app_version: queries.hs_static_app_version || `${formatVersion(options.appInfo.version)}`
    })(options);
};
export const ensureSeleniumParam = options => {
    const seleniumCookie = getCookie('hs_selenium', options.cookies);
    if (!seleniumCookie) {
        return options;
    }
    const queries = params.parse(parseUrl(options.url).query);
    if (queries.hs_selenium_test) {
        return options;
    }
    return query({
        hs_selenium_test: seleniumCookie
    })(options);
};