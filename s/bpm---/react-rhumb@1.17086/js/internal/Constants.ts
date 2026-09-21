export const DEFAULT_TIMEOUT = 60000;
export const INTERNAL_ERROR_MARKERS = ['RHUMB_GLOBAL_ERROR', 'RHUMB_GLOBAL_ERROR_BOUNDARY'];
const unexpectedRouteError = Object.create(Error.prototype);
unexpectedRouteError.message = 'Unexpected route visited. Please see https://product.hubteam.com/docs/frontend/docs/react-rhumb.html#unexpected-route-tracking for more info.';
export const UNEXPECTED_ROUTE_ERROR = unexpectedRouteError;