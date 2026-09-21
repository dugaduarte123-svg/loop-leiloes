import { loadBalancers } from '../constants';
import { getPortalId } from './portalId';
import { createAppLoginUrl, createInternalLoginUrl, redirectTo } from './util/location';
import { clearHsLocale } from 'hs-locale-management';
export function redirectOn(predicate, redirectLocation) {
  return (arg, context) => {
    if (predicate(arg, context)) {
      redirectTo(redirectLocation);
      return arg;
    }
    return arg;
  };
}
export const logoutOn401 = (response, context) => {
  if (response.status === 401) {
    const isAppAuth = context.loadBalancer === loadBalancers.APP;
    const shouldRedirect = !isAppAuth || response.headers.get('x-hubspot-auth-failure') !== null;
    if (shouldRedirect) {
      const loginUrl = isAppAuth ? createAppLoginUrl(context.location) : createInternalLoginUrl(context.loadBalancer, context.location);
      clearHsLocale();
      redirectTo(loginUrl);
    }
  }
  return response;
};
export const logoutOnMissingPortalId = (params, context) => {
  var _hubspot;
  // Only check for APP load balancer, as portal ID is required for app auth
  if (context.loadBalancer !== 'app') {
    return params;
  }
  const portalId = ((_hubspot = window.hubspot) === null || _hubspot === void 0 || (_hubspot = _hubspot.portal) === null || _hubspot === void 0 ? void 0 : _hubspot.id) || getPortalId();
  if (portalId === undefined || portalId === null) {
    clearHsLocale();
    redirectTo(createAppLoginUrl(context.location));
  }
  return params;
};