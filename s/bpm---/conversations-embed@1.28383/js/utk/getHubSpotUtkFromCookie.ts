import { cookies } from '../cookies/constants';
import { getCookie } from '../cookies/operators';
export function getHubSpotUtkFromCookie() {
  return getCookie(cookies.HUBSPOT);
}