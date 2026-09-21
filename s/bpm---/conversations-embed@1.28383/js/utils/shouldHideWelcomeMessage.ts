import { getCookie } from '../cookies/operators';
import { cookies } from '../cookies/constants';
export function shouldHideWelcomeMessage() {
  return !!getCookie(cookies.HIDE_WELCOME_MESSAGE) || false;
}