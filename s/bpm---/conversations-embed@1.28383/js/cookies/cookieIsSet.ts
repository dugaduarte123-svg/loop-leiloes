import { getCookie } from './operators';
export const cookieIsSet = name => {
  return Boolean(getCookie(name));
};