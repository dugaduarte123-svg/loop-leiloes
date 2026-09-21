import { chirpGateways } from '../constants';
export function getPortalId(optionalPath) {
  const portalExpression = /^\/(?:[A-Za-z0-9-_]*)\/(\d+)(?:\/|$)/;
  const portalIdResult = portalExpression.exec(optionalPath || document.location.pathname);
  const portalId = portalIdResult && portalIdResult[1];
  return portalId || undefined;
}

/**
 * Middleware that adds the portal ID as a query parameter
 * Reads the portal ID from window.hubspot.portal.id
 * Only adds portalId for APP gateway type
 */
export const addPortalIdQueryParam = (params, context) => {
  var _hubspot;
  // Only add portalId for APP gateway type
  if (context.gateway !== chirpGateways.APP) {
    return params;
  }

  // Check if portal ID is available in window.hubspot.portal.id
  let portalId = (_hubspot = window.hubspot) === null || _hubspot === void 0 || (_hubspot = _hubspot.portal) === null || _hubspot === void 0 ? void 0 : _hubspot.id;
  if (portalId === undefined || portalId === null) {
    portalId = getPortalId();
  }
  if (portalId === undefined || portalId === null) {
    // No portal ID available, return params unchanged
    return params;
  }

  // Parse the input URL to add query parameter
  // Since addHost runs first, we should always have absolute URLs
  const inputStr = params.input.toString();
  let url;
  try {
    url = new URL(inputStr);
  } catch (_unused) {
    // If URL parsing fails, return unchanged
    return params;
  }

  // Add portalId as a query parameter
  url.searchParams.set('portalId', String(portalId));
  return Object.assign({}, params, {
    input: url.toString()
  });
};