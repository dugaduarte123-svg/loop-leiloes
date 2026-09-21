import { cookies } from './constants';
import { deleteCookie } from './deleteCookie';
import { startOnceReady } from '../startOnceReady';
import { RESET_WIDGET } from '../constants/extendedFunctions';
/**
 * Clear visitor widget-specific cookies from the parent page
 */
export function clearCookies(extendedFunction) {
  deleteCookie(cookies.MESSAGES);
  deleteCookie(cookies.IS_OPEN);
  deleteCookie(cookies.HIDE_WELCOME_MESSAGE);
  deleteCookie(`${cookies.WIDGET_POSITION}_right`);
  deleteCookie(`${cookies.WIDGET_POSITION}_left`);
  deleteCookie(cookies.WIDGET_SIZE);
  if (extendedFunction !== null && extendedFunction !== void 0 && extendedFunction[RESET_WIDGET]) {
    window.hubspot_live_messages_running = false;
    startOnceReady();
  }
}