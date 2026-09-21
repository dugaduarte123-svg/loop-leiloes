import { setCookie } from './operators';
export function deleteCookie(name) {
  setCookie(name, '', -1);
}