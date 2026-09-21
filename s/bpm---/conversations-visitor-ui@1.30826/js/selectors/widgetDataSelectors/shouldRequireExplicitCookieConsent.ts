import { createSelector } from '@reduxjs/toolkit';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
import { getAPIEnableWidgetCookieBanner } from '../../widget-ui/selectors/getAPIEnableWidgetCookieBanner';
import { gdprCookieConsentOnWidgetLoadEnabled } from '../../utils/gdprCookieConsentPromptHelpers';
import { getCookieBannerOnExitVisible } from '../../visitor-identity/operators/getCookieBannerOnExitVisible';
import { getHasMessagesCookieBeenSaved } from '../../gdpr/selectors/getHasMessagesCookieBeenSaved';
import { getVisitorIdentificationEnabled } from '../../visitor-identity/operators/getVisitorIdentificationEnabled';
export const shouldRequireExplicitCookieConsent = createSelector([getLatestWidgetData, getHasMessagesCookieBeenSaved, getAPIEnableWidgetCookieBanner, getCookieBannerOnExitVisible, getVisitorIdentificationEnabled], (widgetData, hasMessagesCookieBeenSaved, shouldEnableWidgetCookieBannerFromAPI, cookieBannerOnExitVisible, visitorIdentificationEnabled) => {
  const gdprCookieConsentOnWidgetLoadIsEnabled = gdprCookieConsentOnWidgetLoadEnabled(widgetData);
  const showCookieConsentBeforeChatting = shouldEnableWidgetCookieBannerFromAPI || gdprCookieConsentOnWidgetLoadIsEnabled;
  return Boolean(showCookieConsentBeforeChatting || cookieBannerOnExitVisible) && !hasMessagesCookieBeenSaved && !visitorIdentificationEnabled;
});