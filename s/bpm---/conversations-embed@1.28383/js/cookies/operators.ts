import Times from './times';
let hasWarnedAboutInsecureCookie = false;
export function getCookie(name) {
  let cookieValue = '';
  if (document.cookie && document.cookie !== '') {
    const currentCookies = document.cookie.split(';');
    for (let i = 0; i < currentCookies.length; i++) {
      const cookie = currentCookies[i].trim();
      if (cookie.substring(0, name.length + 1) === `${name}=`) {
        cookieValue = cookie.substring(name.length + 1);
        break;
      }
    }
  }
  return cookieValue;
}
export function getHostnameWithoutWww() {
  return window.location.hostname.replace(/^www\./, '');
}
export function setCookie(name, value, expireIn = Times.SIX_MONTHS) {
  const expirationDate = new Date(Date.now() + expireIn).toUTCString();
  const hostnameWithoutWww = getHostnameWithoutWww();
  const domain = `.${hostnameWithoutWww}`;
  const cookieParams = [`${name}=${value}`, `expires=${expirationDate}`, `domain=${domain}`, 'path=/', 'SameSite=Lax'];
  if (window.location.protocol.indexOf('https') > -1) {
    cookieParams.push('Secure');
  } else if (!hasWarnedAboutInsecureCookie) {
    // eslint-disable-next-line no-console
    console.warn("HubSpot Conversations: You are using conversations on a non-https site! Not using https puts your visitor's data at risk, please enforce using https.");
    hasWarnedAboutInsecureCookie = true;
  }
  const cookie = cookieParams.join(';');
  document.cookie = cookie;
}