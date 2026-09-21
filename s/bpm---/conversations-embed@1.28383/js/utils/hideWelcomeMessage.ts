import { cookies } from '../cookies/constants';
import { setCookie } from '../cookies/operators';
import times from '../cookies/times';
export const hideWelcomeMessage = () => {
  setCookie(cookies.HIDE_WELCOME_MESSAGE, true, times.ONE_DAY);
};