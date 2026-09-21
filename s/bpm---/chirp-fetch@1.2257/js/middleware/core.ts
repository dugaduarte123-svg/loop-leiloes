// @ts-ignore untyped loader
import * as currentPackage from 'current-package-loader!';
import { chirpGateways } from '../constants';
export function getCoreServiceContext() {
  return {
    location: window.location,
    cookie: window.document.cookie,
    currentPackage: currentPackage
  };
}
export const includeCredentials = (params, context) => {
  // For external APIs, don't include credentials
  // This prevents cookies from being sent to third-party services
  const credentials = context.gateway === chirpGateways.EXTERNAL ? 'omit' : 'include';
  return Object.assign({}, params, {
    init: Object.assign({}, params.init, {
      credentials
    })
  });
};