import { getFullUrlPure } from 'hubspot-url-utils/pure';
import { loadBalancers } from '../constants';
import { redirectTo } from './util/location';
import { getPortalId } from './portalId';
import enviro from '../util/enviro';
export const MIGRATION_IN_PROGRESS_MESSAGE = 'migration in progress';
export const PORTAL_MOVED_MESSAGE = 'portal moved';
function maybeGetParentIframe() {
  try {
    if (window.self !== window.top) {
      return window.top;
    }
  } catch (e) {
    return null;
  }
  return null;
}
function getAppOrigin() {
  return new URL(getFullUrlPure('app', enviro.getHublet(), enviro.getShort())).origin;
}
function getLbOriginForHublet(loadBalancer, hublet) {
  const env = enviro.getShort();
  switch (loadBalancer) {
    case loadBalancers.APP:
      return new URL(getFullUrlPure('app', hublet, env)).origin;
    case loadBalancers.TOOLS:
      return new URL(getFullUrlPure('tools', hublet, env, {
        domainOverride: 'hubteam'
      })).origin;
    case loadBalancers.PRIVATEHUBTEAM:
      return new URL(getFullUrlPure('private', hublet, env, {
        domainOverride: 'hubteam'
      })).origin;
    default:
      {
        // This is to catch non-tradiational LB's such as ecosystem and marketplace
        const segments = window.location.hostname.split('.');
        const lbBase = segments.length >= 3 ? segments[0].split('-')[0] : 'app';
        return new URL(getFullUrlPure(lbBase, hublet, env)).origin;
      }
  }
}

// From hub-http for portal migration
// https://sourcegraph.hubteam.com/github.com/HubSpotEngineering/hub-http@e34de300d7462a85442e3056e619acd30fb78949/-/blob/hub-http/static/js/middlewares/core.js?L378
// https://sourcegraph.hubteam.com/github.com/HubSpotEngineering/hub-http/-/blob/hub-http/static/js/helpers/iframe.js?L28
export const redirectOnMigrationInProgress = (response, context) => {
  if (response.status === 477) {
    var _hubspot;
    const parentWindow = maybeGetParentIframe();
    if (parentWindow) {
      parentWindow.postMessage(MIGRATION_IN_PROGRESS_MESSAGE, '*');
      return response;
    }
    const portalId = ((_hubspot = window.hubspot) === null || _hubspot === void 0 || (_hubspot = _hubspot.portal) === null || _hubspot === void 0 ? void 0 : _hubspot.id) || getPortalId(context.location.pathname);
    const appOrigin = getAppOrigin();
    if (portalId) {
      redirectTo(`${appOrigin}/data-transfer-status/${portalId}/`);
    }
  }
  return response;
};

// Also from hub-http for portal moved
// https://sourcegraph.hubteam.com/github.com/HubSpotEngineering/hub-http@e34de300d7462a85442e3056e619acd30fb78949/-/blob/hub-http/static/js/middlewares/core.js?L404
export const redirectOnPortalMoved = (response, context) => {
  if (response.status === 488) {
    const parentWindow = maybeGetParentIframe();
    if (parentWindow) {
      parentWindow.postMessage(PORTAL_MOVED_MESSAGE, '*');
      return response;
    }
    const correctHublet = response.headers.get('x-hubspot-correct-hublet');
    if (!correctHublet) {
      return response;
    }
    const {
      location,
      loadBalancer
    } = context;
    const newOrigin = getLbOriginForHublet(loadBalancer, correctHublet);
    const search = location.search;
    const hash = location.hash;
    redirectTo(`${newOrigin}${location.pathname}${search}${hash}`);
  }
  return response;
};