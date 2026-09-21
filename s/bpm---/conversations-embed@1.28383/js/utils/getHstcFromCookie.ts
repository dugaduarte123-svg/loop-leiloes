import { cookies } from '../cookies/constants';
import { getCookie } from '../cookies/operators';
export function getHstcFromCookie() {
  return getCookie(cookies.HSTC);
}