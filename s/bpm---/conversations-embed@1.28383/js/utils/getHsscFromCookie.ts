import { cookies } from '../cookies/constants';
import { getCookie } from '../cookies/operators';
export function getHsscFromCookie() {
  return getCookie(cookies.HSSC);
}