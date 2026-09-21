import { getCookie } from '../cookies/operators';
import { isUtk } from './isUtk';
import { cookies } from '../cookies/constants';
export function getMessagesUtkFromCookie() {
  const messagesCookieValue = getCookie(cookies.MESSAGES);
  return isUtk(messagesCookieValue) ? messagesCookieValue : undefined;
}