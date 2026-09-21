import { getCookie } from '../cookies/operators';
import { cookies } from '../cookies/constants';
export function getGlobalCookieOptOut() {
  return getCookie(cookies.GLOBAL_COOKIE_OPT_OUT);
}