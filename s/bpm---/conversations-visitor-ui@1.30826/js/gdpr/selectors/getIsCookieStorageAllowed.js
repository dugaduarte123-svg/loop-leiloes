'use es6';

import {
    gdprCookieConsentOnExitIntentEnabled,
    gdprCookieConsentOnWidgetLoadEnabled
} from '../../utils/gdprCookieConsentPromptHelpers';
import {
    getIsPrivateLoad
} from '../../widget-data/operators/getIsPrivateLoad';
import {
    getGlobalCookieOptOut,
    OPT_OUT_NO,
    OPT_OUT_YES
} from '../../visitor-identity/selectors/getGlobalCookieOptOut';
import {
    getAPIEnableWidgetCookieBannerOnExitIntent
} from '../../widget-ui/selectors/getAPIEnableWidgetCookieBannerOnExitIntent';
import {
    getAPIEnableWidgetCookieBanner
} from '../../widget-ui/selectors/getAPIEnableWidgetCookieBanner';
import {
    getLatestWidgetData
} from '../../widget-data/selectors/getLatestWidgetData';
import {
    getHasMessagesCookieBeenSaved
} from './getHasMessagesCookieBeenSaved';
import {
    getIsPortal53Prod
} from '../../widget-data/operators/getIsPortal53Prod';
import {
    getShouldListenToGdprBannerConsent
} from '../../widget-data/operators/getShouldListenToGdprBannerConsent';
export const getIsCookieStorageAllowed = (state, widgetDataOverride) => {
    const widgetData = widgetDataOverride || getLatestWidgetData(state);
    const isPrivateLoad = getIsPrivateLoad(state);
    const globalCookieOptOut = getGlobalCookieOptOut(state);
    const APIEnableWidgetCookieBannerOnExitIntent = getAPIEnableWidgetCookieBannerOnExitIntent(state);
    const APIEnableWidgetCookieBanner = getAPIEnableWidgetCookieBanner(state);
    const cookieConsentOnExitEnabled = gdprCookieConsentOnExitIntentEnabled(state, widgetData);
    const cookieConsentOnWidgetLoadEnabled = gdprCookieConsentOnWidgetLoadEnabled(widgetData);
    const hasMessagesCookieBeenSaved = getHasMessagesCookieBeenSaved(state);
    const isPortal53 = getIsPortal53Prod();
    const shouldListenToGdprBannerConsent = getShouldListenToGdprBannerConsent(widgetData);
    if (globalCookieOptOut === OPT_OUT_YES) {
        return false;
    }
    if (globalCookieOptOut === OPT_OUT_NO) {
        return true;
    }
    if (hasMessagesCookieBeenSaved) {
        return true;
    }

    // opt in is required for 53 + GDPR laws
    if (isPortal53 && shouldListenToGdprBannerConsent) {
        return false;
    }
    if (cookieConsentOnExitEnabled || APIEnableWidgetCookieBanner || cookieConsentOnWidgetLoadEnabled || APIEnableWidgetCookieBannerOnExitIntent || isPrivateLoad) {
        return false;
    }
    return true;
};