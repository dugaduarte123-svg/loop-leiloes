// stolen from portalIdParser
const pathRegex = /^\/(?:[A-Za-z0-9-_]*)\/(\d+)(?:\/|$)/;
export function getPortalIdFromPath(path) {
  try {
    return pathRegex.exec(path)[1];
  } catch (e) {
    return '';
  }
}