import { getCookie } from '../cookies/operators';
import { cookies } from '../cookies/constants';
export const addCsrfHeader = xhr => {
  xhr.setRequestHeader('X-HubSpot-CSRF-hubspotapi', getCookie(cookies.HUBSPOT_API_CSRF));
};
export const addAuthToRequest = xhr => {
  addCsrfHeader(xhr);
  xhr.withCredentials = true;
};