'use es6';

import {
    header,
    withUrl
} from './core';
import {
    parseUrl,
    buildUrl
} from '../helpers/url';
import {
    set
} from '../helpers/update';
import {
    isAuthMocked
} from '../helpers/authMocked';
import {
    lab
} from './lab';
import Env from 'enviro';
const regexRewriteUrl = (url, patternsRaw) => {
    let parsedPatterns = JSON.parse(patternsRaw);
    if (!Array.isArray(parsedPatterns)) {
        // eslint-disable-next-line no-console
        console.error('REWRITE_URL local storage key must be a stringified array');
        return url;
    }
    if (!parsedPatterns.length) return url;
    let urlString = buildUrl(url);
    if (typeof parsedPatterns[0] === 'string' || parsedPatterns[0] instanceof String) {
        parsedPatterns = [parsedPatterns];
    }
    parsedPatterns.forEach(([pattern, replacement]) => {
        urlString = urlString.replace(new RegExp(pattern), replacement);
    });
    return parseUrl(urlString);
};
const localOverideUrl = (url, localOverrides) => {
    const parsedOverrides = JSON.parse(localOverrides);
    if (!Array.isArray(parsedOverrides)) {
        // eslint-disable-next-line no-console
        console.error('LOCAL_API_OVERRIDES local storage key must be a stringified array');
        return url;
    }
    let urlString = buildUrl(url);
    parsedOverrides.forEach(overrideString => {
        if (urlString.includes(overrideString)) {
            urlString = urlString.replace(/https:\/\/(app|api)/, 'https://local').replace('/api/', '/'); // Need to remove the `/api/` bit for local api requests
        }
    });
    return parseUrl(urlString);
};
export const rewriteUrl = options => withUrl(url => {
    const patternsRaw = options.localStorage && options.localStorage.getItem('URL_REWRITE');
    if (patternsRaw) {
        return regexRewriteUrl(url, patternsRaw);
    }
    const localOverrides = options.localStorage && options.localStorage.getItem('LOCAL_API_OVERRIDES');
    if (localOverrides) {
        return localOverideUrl(url, localOverrides);
    }
    return url;
})(options);
const TIMEOUT_OVERRIDE_KEY = 'HUB-HTTP_TIMEOUT';
export const allowTimeoutOverride = options => {
    const timeoutOverride = options.localStorage && options.localStorage.getItem(TIMEOUT_OVERRIDE_KEY);
    if (timeoutOverride != null) {
        // eslint-disable-next-line no-console
        console.log(`[hub-http] Using localStorage override ${TIMEOUT_OVERRIDE_KEY} for request timeout.`);
        return set('timeout', parseInt(timeoutOverride, 10))(options);
    }
    return options;
};
const FAILURE_INJECTION_KEY = 'HTTP_FAILURE_INJECTION';
const DEFAULT_SCOPE = 'default';
const injectionConfigDefaults = {
    rate: 1.0,
    sleep: 1000
};

/** The Java agent fails to parse the rate if its note passed as a float */
const rateToString = rate => rate === 1 ? '1.0' : String(rate);
const buildFailureInjectionHeader = injectionConfig => `${injectionConfig.type};${injectionConfig.scope};ABORT;1;${rateToString(injectionConfig.rate)};${injectionConfig.sleep}`;

/**
 * @typedef {Object} InjectionConfig
 * @property {string} type
 * @property {string} scope
 * @property {number} rate likelihood the failure takes place, in a range of [0.0, 1.0]
 * @property {number} sleep a time, in milliseconds, to wait before failing the request
 */

/**
 * @returns {InjectionConfig | undefined}
 */
const parseFailureInjectionConfig = rawInjectionConfig => {
    let injectionConfig;
    try {
        injectionConfig = JSON.parse(rawInjectionConfig);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('failure injection config must be valid config object, see failure injection docs for more info');
    }
    return injectionConfig;
};
export const applyFailureInjectionHeader = options => {
    // only enable client-side failure injection in QA for now
    if (!Env.isQa()) {
        return options;
    }
    const rawInjectionConfig = options.localStorage && options.localStorage.getItem(FAILURE_INJECTION_KEY);
    if (!rawInjectionConfig) {
        return options;
    }
    const parsedInjectionConfig = parseFailureInjectionConfig(rawInjectionConfig);
    if (!parsedInjectionConfig) {
        return options;
    }
    const injectionConfig = Object.assign({}, injectionConfigDefaults, parsedInjectionConfig);
    if (!injectionConfig.type || !injectionConfig.scope) {
        // eslint-disable-next-line no-console
        console.error('failure injection config missing required property (required: type, scope). see failure injection docs for more info');
        return options;
    }

    // the backend applies `INCOMING_HTTP` blindly, so we implement a fake scope for
    // this config type on the client
    const {
        path = ''
    } = parseUrl(options.url);
    if (injectionConfig.type === 'INCOMING_HTTP' && injectionConfig.scope !== DEFAULT_SCOPE && !path.includes(injectionConfig.scope)) {
        return options;
    }
    return header('X-HubSpot-Failure-Injection', buildFailureInjectionHeader(injectionConfig))(options);
};
export const enableFailureInjection = options => {
    if (isAuthMocked(options)) {
        return options;
    }
    return lab('HUBONEDOMAIN', applyFailureInjectionHeader)(options);
};