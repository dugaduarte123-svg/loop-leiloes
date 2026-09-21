/**
 * Cleanses a route string to avoid getting dropped by the RCE attempt filter when we send it in metric dimensions
 * https://github.com/HubSpotEngineering/metrics-queue/blob/12088f24e21e7af5b1be7c393fa02aac43e88c71/metrics-ingest-data/src/main/java/com/hubspot/metrics/ingest/frontend/FrontendMetricsManager.java#L56
 * @param route
 */
const REPLACE_CHAR_WITH_HYPHEN_REGEX = /[^a-zA-Z0-9_]/g;
const MULTI_HYPHEN_REGEX = /-+/g;
export function cleanseRoute(route) {
  route = route.replace(REPLACE_CHAR_WITH_HYPHEN_REGEX, '-').replace(MULTI_HYPHEN_REGEX, '-');
  // Remove leading hyphen
  if (route.startsWith('-')) {
    route = route.slice(1);
  }
  return route;
}