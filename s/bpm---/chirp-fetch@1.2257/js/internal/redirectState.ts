let redirectsDisabled = false;
export function disableRedirects() {
  redirectsDisabled = true;
}
export function areRedirectsDisabled() {
  return redirectsDisabled;
}