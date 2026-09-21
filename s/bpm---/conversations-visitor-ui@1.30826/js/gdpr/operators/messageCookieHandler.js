'use es6';

import {
    localStorageKeys
} from '../../localStorage/constants/storageKeys';
import {
    getIsCookieStorageAllowed
} from '../selectors/getIsCookieStorageAllowed';
import {
    handleStoreMessagesCookie
} from '../../post-message/handleStoreMessagesCookie';
import {
    getMessagesUtk
} from '../../query-params/getMessagesUtk';
import {
    getHasMessagesCookieBeenSaved
} from '../selectors/getHasMessagesCookieBeenSaved';
import {
    getGlobalCookieOptOut
} from '../../visitor-identity/operators/getGlobalCookieOptOut';
import {
    OPT_OUT_YES
} from '../../visitor-identity/selectors/getGlobalCookieOptOut';
import {
    shouldRequireExplicitCookieConsent
} from '../../selectors/widgetDataSelectors/shouldRequireExplicitCookieConsent';
export const messageCookieHandler = ({
    currentState,
    widgetData
}) => {
    const isCookieStorageAllowed = getIsCookieStorageAllowed(currentState, widgetData);
    const hasMessagesCookieBeenSaved = getHasMessagesCookieBeenSaved(currentState);
    const globalCookieOptOut = getGlobalCookieOptOut(currentState) === OPT_OUT_YES;
    const consentRequired = shouldRequireExplicitCookieConsent(currentState);
    if (hasMessagesCookieBeenSaved && globalCookieOptOut) {
        try {
            localStorage.removeItem(localStorageKeys.HUBLYTICS_EVENTS_53);
            localStorage.removeItem(localStorageKeys.HMPL);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('Unable to access localStorage');
        }
    } else if (isCookieStorageAllowed && !consentRequired) {
        handleStoreMessagesCookie(getMessagesUtk());
    }
};