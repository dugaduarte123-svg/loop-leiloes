import { HUBSPOT_UTK, GLOBAL_COOKIE_OPT_OUT } from '../iframe-communication/constants/sentPostMessageTypes';
import { cookieValues, cookies } from './constants';
import { deleteCookie } from './deleteCookie';
export const registerCookieListeners = ({
  postMessageToIframe
}) => {
  const handlePrivacyConsent = consent => {
    const allowedMessagesUtkCookie = consent.categories ? consent.categories.functionality : consent.allowed;
    const globalCookieOptOut = allowedMessagesUtkCookie ? cookieValues.GLOBAL_COOKIE_OPT_OUT_NO : cookieValues.GLOBAL_COOKIE_OPT_OUT_YES;
    postMessageToIframe(GLOBAL_COOKIE_OPT_OUT, {
      globalCookieOptOut
    });
    if (!allowedMessagesUtkCookie) {
      deleteCookie(cookies.MESSAGES);
    }
  };

  // https://git.hubteam.com/hubSpot/analytics_js#available-callbacks
  window._hsq = window._hsq || [];
  window._hsq.push(['addPrivacyConsentListener', handlePrivacyConsent]);
  window._hsq.push(['addUserTokenListener', utk => postMessageToIframe(HUBSPOT_UTK, {
    utk
  })]);
};