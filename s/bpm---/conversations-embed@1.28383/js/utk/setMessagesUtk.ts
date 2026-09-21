import { setCookie } from '../cookies/operators';
import { cookies } from '../cookies/constants';
export function setMessagesUtk(value) {
  setCookie(cookies.MESSAGES, value);
}