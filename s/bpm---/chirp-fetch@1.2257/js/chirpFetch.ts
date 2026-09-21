import { createWrappedFetch } from './wrappedFetch';
import { getCoreServiceContext, includeCredentials } from './middleware/core';
import { logoutOn401, logoutOnMissingPortalId } from './middleware/logout';
import { redirectOnMigrationInProgress, redirectOnPortalMoved } from './middleware/redirects';
import { setStandardHeaders } from './middleware/headers';
import { addPortalIdQueryParam } from './middleware/portalId';
import { addHostPure } from './middleware/addHostPure';
import { withStaticAppInfo } from './middleware/staticAppInfo';
import { chirpGateways } from './constants';
export const createChirpFetch = ({
  loadBalancer,
  gateway,
  env,
  hublet,
  useLongLivedLb
}) => {
  const isExternalGateway = gateway === chirpGateways.EXTERNAL;
  const baseConfiguration = {
    context: {
      gateway,
      loadBalancer,
      env,
      hublet,
      useLongLivedLb
    },
    requestContext: [getCoreServiceContext],
    middleware: [addHostPure,
    // Must run first to ensure all URLs are absolute
    includeCredentials, setStandardHeaders,
    // Tag every request with the app's static-app identity so the gateway
    // can key its CORS allow-origin decision on it.
    withStaticAppInfo,
    // Only check portal ID for APP load balancer, not EXTERNAL
    ...(isExternalGateway ? [] : [logoutOnMissingPortalId]), addPortalIdQueryParam],
    onResponse: [
    // Don't logout on 401 for external APIs
    ...(isExternalGateway ? [] : [logoutOn401, redirectOnMigrationInProgress, redirectOnPortalMoved])],
    onResponseError: []
  };
  return createWrappedFetch(baseConfiguration);
};
export function createChirpFetchConfig({
  loadBalancer,
  gateway,
  env,
  hublet,
  useLongLivedLb
}) {
  return {
    loadBalancer,
    gateway,
    env,
    hublet,
    useLongLivedLb
  };
}