import { loadBalancers } from '../../constants';
import { areRedirectsDisabled } from '../../internal/redirectState';
const appRegex = /^(?:[\w-]+\.)*?(app|local)((-[\w-]*)?\.(hubspot(qa)?)\.com)$/;
const hubteamRegex = /^(?:[\w-]+\.)*?(tools|private|local)((-[\w-]*)?(\.hubteam(qa)?\.com))$/;
export function redirectTo(location) {
  if (areRedirectsDisabled()) {
    return;
  }
  window.location.href = location;
}
function formatLoginPath(loginPathOverride) {
  return loginPathOverride ? loginPathOverride.startsWith('/') ? loginPathOverride : `/${loginPathOverride}` : undefined;
}
export function createInternalLoginUrl(loadBalancer, location, loginPathOverride) {
  return createLoginUrl(loadBalancers.TOOLS, location, loginPathOverride || '/login', new URLSearchParams({
    next: location.href
  }));
}
export function createAppLoginUrl(location, loginPathOverride) {
  return createLoginUrl(loadBalancers.APP, location, loginPathOverride || '/login', new URLSearchParams({
    loginRedirectUrl: location.href
  }));
}
function createLoginUrl(loadBalancer, location, loginPath, usp) {
  const searchParams = usp.toString();
  const formattedLoginPath = formatLoginPath(loginPath);
  const hostname = withSubdomainOverride(loadBalancer, location.hostname);
  if (!hostname) {
    console.error(`Invalid hostname or unknown load balancer ${loadBalancer} at ${location.href}`);
    return '';
  }
  return `https://${hostname}${formattedLoginPath}?${searchParams}`;
}
export function withSubdomainOverride(loadBalancer, hostname) {
  // TODO: We probably want to be able to override the subdomain to point to local.
  switch (loadBalancer) {
    case loadBalancers.APP:
      return appRegex.test(hostname) ? hostname.replace(appRegex, 'app$2') : false;
    case loadBalancers.PRIVATEHUBTEAM:
      return hubteamRegex.test(hostname) ? hostname.replace(hubteamRegex, 'private$2') : false;
    case loadBalancers.TOOLS:
      return hubteamRegex.test(hostname) ? hostname.replace(hubteamRegex, 'tools$2') : false;
    default:
      return false;
  }
}