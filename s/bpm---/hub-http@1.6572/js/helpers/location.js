'use es6';

import {
    isSafeMode
} from './safeMode';
import {
    parse
} from '../helpers/params';
import {
    isAuthMocked
} from '../helpers/authMocked';
const noop = () => {};

// Params will never be nested, but we do need to check for arrays
export const searchParamsEquality = (obj1, obj2) => {
    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);
    if (obj1Keys.length !== obj2Keys.length) {
        return false;
    }
    return Object.keys(obj1).every(k => {
        const obj1v = obj1[k];
        const obj2v = obj2[k];
        if (!Object.prototype.hasOwnProperty.call(obj2, k)) {
            return false;
        }
        if (typeof obj1v === 'string') {
            return typeof obj2v === 'string' && obj2v === obj1v;
        } else if (Array.isArray(obj1v)) {
            return Array.isArray(obj2v) && obj1v.every(i => obj2v.includes(i)) && obj2v.every(i => obj1v.includes(i));
        } else {
            // this should be unreachable; parse() either returns strings from decodeURIComponent or arrays of the same
            return false;
        }
    });
};
export const redirectTo = (redirectUrl, options, onRedirect = noop) => {
    if (isAuthMocked(options)) return false;
    const overrideKey = 'HUB-HTTP_IGNORE_REDIRECTS';
    const isTrue = v => v && v.toLowerCase() === 'true';
    const skipConditions = [
        [() => options.ignoreRedirect, 'ignoreRedirect option is set'],
        [() => options.localStorage && isTrue(options.localStorage.getItem(overrideKey)), `local storage key ${overrideKey} is set to "true"`],
        [() => isSafeMode(options), 'safe mode is enabled'],
        [() => {
            try {
                const parsedRedirect = new URL(redirectUrl);
                const currentLocation = options.location;
                const redirectParams = parse((parsedRedirect.search || '').substring(1));
                const currentParams = parse((currentLocation.search || '').substring(1));
                return parsedRedirect.protocol === currentLocation.protocol && parsedRedirect.hostname === currentLocation.hostname && parsedRedirect.pathname === currentLocation.pathname && parsedRedirect.hash === currentLocation.hash && searchParamsEquality(redirectParams, currentParams);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Error checking for infinite redirect', error);
                return false;
            }
        }, 'redirect URL is identical to current location']
    ];
    const condition = skipConditions.find(([predicate]) => predicate());
    if (condition) {
        // eslint-disable-next-line no-console
        console.log(`[hub-http] Skipping redirect because ${condition[1]}`);
        return false;
    }
    onRedirect(options);
    options.location.href = redirectUrl;
    return true;
};