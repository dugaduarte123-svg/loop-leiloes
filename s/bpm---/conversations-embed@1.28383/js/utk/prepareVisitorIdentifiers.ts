import { chooseMessagesUtk } from './chooseMessagesUtk';
import { getMessagesUtkFromCookie } from './getMessagesUtkFromCookie';
import { getHubSpotUtkFromCookie } from './getHubSpotUtkFromCookie';
import { getGlobalCookieOptOut } from './getGlobalCookieOptOut';
import { getHstcFromCookie } from '../utils/getHstcFromCookie';
import { getHsscFromCookie } from '../utils/getHsscFromCookie';
import { setMessagesUtk } from './setMessagesUtk';
export const prepareVisitorIdentifiers = () => {
  /**
   * We check for a `messagesUtk` cookie
   * If it's present AND a uuid, use it
   * If not, store it in memory and wait for the visitor-ui to prompt
   * the shell to set it to a cookie
   */
  const existingMessagesUtk = getMessagesUtkFromCookie();
  if (existingMessagesUtk) {
    /**
     * If there is already a messagesUtk cookie value, reset the cookie
     * to ensure it has the proper expiry (13 months)
     */
    setMessagesUtk(existingMessagesUtk);
  }

  /**
   * The analytics script drops a `hubspotUtk` cookie
   * If GDPR is enabled and consent has not been given,
   * it may not be present
   */
  const hubspotUtk = getHubSpotUtkFromCookie();
  const hstc = getHstcFromCookie();
  const hssc = getHsscFromCookie();
  const globalCookieOptOut = getGlobalCookieOptOut();
  const {
    messagesUtk,
    isFirstVisitorSession
  } = chooseMessagesUtk({
    existingMessagesUtk
  });
  return {
    messagesUtk,
    hubspotUtk,
    hstc,
    hssc,
    globalCookieOptOut,
    isFirstVisitorSession
  };
};