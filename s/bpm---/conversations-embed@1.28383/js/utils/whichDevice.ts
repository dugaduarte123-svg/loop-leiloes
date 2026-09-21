// @ts-ignore ts-migrate(2307) FIXME: Cannot find module 'ismobilejs' or its correspondi... Remove this comment to see the full error message
import isMobile from '../../vendor/ismobilejs'; // import-eslint-disable-line

const webkit = /WebKit/i;
function match(regex, userAgent) {
  return regex.test(userAgent);
}
export function getMobileState(userAgent = window.navigator.userAgent) {
  let ua = userAgent;

  // Facebook mobile app's integrated browser adds a bunch of strings that
  // match everything. Strip it out if it exists.
  let tmp = ua.split('[FBAN');
  if (typeof tmp[1] !== 'undefined') {
    ua = tmp[0];
  }
  tmp = ua.split('Twitter');
  if (typeof tmp[1] !== 'undefined') {
    ua = tmp[0];
  }
  const isMobileInstance = isMobile(ua);
  isMobileInstance.other.webkit = match(webkit, ua);
  isMobileInstance.safari = isMobileInstance.apple.device && isMobileInstance.other.webkit && !isMobileInstance.other.opera && !isMobileInstance.other.chrome;
  return isMobileInstance;
}
export function isAnyMobile() {
  const mobileState = getMobileState();
  // any includes things that are not included in phone ie 7 inch and 'other'
  // tablet isn only known tablets ipad, android tablet, and windows tablet
  // this logic will make sure are more likely to fall back to mobile than the desktop experience
  // if we do no know the device
  return mobileState.any && !mobileState.tablet;
}
export function isMobileSafari() {
  return getMobileState().safari;
}
export function isWindowsMobile() {
  return getMobileState().windows.phone;
}
export function isIOSMobile() {
  return getMobileState().apple.phone;
}