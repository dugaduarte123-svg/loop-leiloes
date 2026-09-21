'use es6';

import _objectDestructuringEmpty from "@babel/runtime/helpers/esm/objectDestructuringEmpty";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["cached"];
import http from './clients/loginVerifyClient';
import {
    getMemoizedInfo,
    setMemoizedInfo,
    getMemoizedPromise,
    setMemoizedPromise
} from './userInfo-state';
import {
    triggerEvent
} from './helpers/events';
import {
    isAuthMocked
} from './helpers/authMocked';
import {
    setCustomAttribute,
    MARK_USER_INFO_START,
    MARK_USER_INFO_SUCCESS,
    MEASURE_USER_INFO_TIME,
    MEASURE_API_VERIFY_TIME
} from './helpers/newRelicReporting';
import {
    transformUserInfoResponse
} from './userInfo-internal';
import {
    persistHsLocaleFromUserInfo
} from 'hs-locale-management';
export {
    transformHublessUserInfoResponse,
    transformUserInfoResponse
}
from './userInfo-internal';
const getUserInfo = options => {
    const {
        cached = true
    } = options,
    otherOptions = _objectWithoutPropertiesLoose(options, _excluded);

    // don't use early requester if we're trying to refresh the data
    if (!cached && otherOptions.externalResponse) {
        delete otherOptions.externalResponse;
    }
    const memoizedPromise = getMemoizedPromise();
    if (cached && memoizedPromise) {
        otherOptions.recycledPromise = memoizedPromise;
    }
    const loginVerifyCall = http('/login-verify', otherOptions);
    if (!cached || !memoizedPromise) {
        setMemoizedPromise(loginVerifyCall);
    }
    return loginVerifyCall.then(({
        data
    }) => data);
};
let earlyRequestPromise;
export function resetEarlyRequestPromiseForTesting() {
    earlyRequestPromise = undefined;
}
const NO_EARLY_QUICK_FETCH_FOUND_MESSAGE = 'No quick-fetch early login-verify request found';
const earlyRequest = () => {
    if (!earlyRequestPromise) {
        earlyRequestPromise = new Promise((resolve, reject) => {
            const request = window.quickFetch && window.quickFetch.getRequestStateByName('api-verify');
            if (!request) {
                reject(new Error(NO_EARLY_QUICK_FETCH_FOUND_MESSAGE));
                setCustomAttribute('earlyRequesterRequestNotFound', 'true');
                setCustomAttribute('earlyRequesterFinished', 'false');
                return;
            }
            const earlyRequesterFinished = request.finished;
            request.whenFinished(data => {
                setCustomAttribute('earlyRequesterFinished', `${Boolean(earlyRequesterFinished)}`);
                if (window.performance && typeof window.performance.getEntriesByName === 'function' && window.performance.getEntriesByName(MEASURE_API_VERIFY_TIME).length) {
                    setCustomAttribute('earlyRequesterApiTime', window.performance.getEntriesByName(MEASURE_API_VERIFY_TIME)[0].duration);
                }
                return resolve(data);
            });
            request.onError(xhr => {
                reject(new Error(`[hub-http] EarlyRequester token refresh attempt failed with status ${xhr.status}: ${xhr.statusText}`));
            });
        });
    }
    return earlyRequestPromise;
};
const get = options => {
    const {
        cached = true
    } = options;
    const isFreshRequest = !cached || !getMemoizedPromise();
    const authMocked = isAuthMocked(options);
    // when earlyRequester fails, pass control over to the login verify client to try again
    const earlyRequestFallback = reason => {
        if (reason && (
                // Our recommendation is to test the app without quick-fetch
                // We want to reduce console noise by filtering out "NO_EARLY_QUICK_FETCH_FOUND_MESSAGE" errors.
                !authMocked || reason.message !== NO_EARLY_QUICK_FETCH_FOUND_MESSAGE)) {
            // eslint-disable-next-line no-console
            console.error(reason.message);
        }
        return getUserInfo(options);
    };

    // when earlyRequester succeeds, send a dummy response in the login verify's client for processing
    const dummyResponse = response => ({
        status: 200,
        statusText: 'OK',
        data: response
    });
    const request = earlyRequest().then(response => getUserInfo(Object.assign({}, options, {
        externalResponse: dummyResponse(response)
    }))).catch(earlyRequestFallback);
    return request.then(response => {
        var _info$user;
        const info = transformUserInfoResponse(response);
        persistHsLocaleFromUserInfo((_info$user = info.user) === null || _info$user === void 0 ? void 0 : _info$user.hs_locale, isFreshRequest);
        if (window.performance && typeof window.performance.mark === 'function' && typeof window.performance.measure === 'function' && typeof window.performance.getEntriesByName === 'function') {
            window.performance.mark(MARK_USER_INFO_SUCCESS);
            window.performance.measure(MEASURE_USER_INFO_TIME, MARK_USER_INFO_START, MARK_USER_INFO_SUCCESS);
            const userInfoTime = window.performance.getEntriesByName(MEASURE_USER_INFO_TIME).length ? window.performance.getEntriesByName(MEASURE_USER_INFO_TIME)[0].duration : -1;
            setCustomAttribute('userInfoTime', userInfoTime);
        }
        triggerEvent('hubspot:userinfochange', info);
        return info;
    });
};
const userInfo = (options = {}) => {
    const others = Object.assign({}, (_objectDestructuringEmpty(options), options));
    if (window.performance && typeof window.performance.mark === 'function') {
        window.performance.mark(MARK_USER_INFO_START);
    }
    return get(others).then(data => {
        setMemoizedInfo(data);
        return data;
    });
};
export const userInfoWithDelegatedOptions = ({
    cached,
    ignoreRedirect,
    safeMode,
    allowSuspended
}) => userInfo({
    cached,
    ignoreRedirect,
    safeMode,
    allowSuspended
});
export const userInfoSafe = options => userInfo(Object.assign({}, options, {
    safeMode: true
}));
export const userInfoSync = () => {
    const memoizedInfo = getMemoizedInfo();
    if (!memoizedInfo) {
        throw new Error('User info has not be loaded yet. Did you call userInfoSync before the userInfo promise resolved?');
    }
    return memoizedInfo;
};

// TODO this can be removed my migrating all existing consumers to import from `userInfo-state.js` and adding the entry to "publicModules"
export {
    clearCacheForTesting
}
from './userInfo-state';
export default userInfo;