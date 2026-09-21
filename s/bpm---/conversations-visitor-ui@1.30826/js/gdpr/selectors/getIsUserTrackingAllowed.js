'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    getLatestWidgetData
} from '../../widget-data/selectors/getLatestWidgetData';
import {
    getGlobalCookieOptOut,
    OPT_OUT_NO,
    OPT_OUT_YES
} from '../../visitor-identity/selectors/getGlobalCookieOptOut';
import {
    getIsPortal53Prod
} from '../../widget-data/operators/getIsPortal53Prod';
import {
    getShouldListenToGdprBannerConsent
} from '../../widget-data/operators/getShouldListenToGdprBannerConsent';
import {
    getUserHasGivenConsentToProcess
} from './getHasUserGivenConsentToProcess';
export const getIsUserTrackingAllowed = createSelector([getLatestWidgetData, getGlobalCookieOptOut, getUserHasGivenConsentToProcess], (widgetData, globalCookieOptOut, userHasGivenConsentToProcess) => {
    const isPortal53 = getIsPortal53Prod();
    const shouldListenToGdprBannerConsent = getShouldListenToGdprBannerConsent(widgetData);
    if (globalCookieOptOut === OPT_OUT_YES) {
        return false;
    }
    if (globalCookieOptOut === OPT_OUT_NO) {
        return true;
    }

    // opt in is required for 53 + GDPR laws
    if (isPortal53 && shouldListenToGdprBannerConsent) {
        return false;
    }
    return userHasGivenConsentToProcess;
});