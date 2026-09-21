import { isHubteamDomain } from '../utils/isHubteamDomain';
let _defaultClient;
export const setDefaultHttpClient = client => {
  _defaultClient = client;
};
const TOOLS_REGEX = /^(?:.*)tools(?:-[^.]+)?\.hubteam/;
const HUBTEAM_DOMAIN = /\.hubteam(qa)?\.com$/;
export function configureChirpFetch(hostname = typeof window !== 'undefined' && (_window$location => (_window$location = window.location) === null || _window$location === void 0 ? void 0 : _window$location.hostname)() || '') {
  const {
    createChirpFetch,
    loadBalancers,
    chirpGateways
  } =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('chirp-fetch');
  if (TOOLS_REGEX.test(hostname)) {
    setDefaultHttpClient(createChirpFetch({
      loadBalancer: loadBalancers.TOOLS,
      gateway: chirpGateways.INTERNAL
    }));
  } else if (HUBTEAM_DOMAIN.test(hostname)) {
    setDefaultHttpClient(createChirpFetch({
      loadBalancer: loadBalancers.PRIVATEHUBTEAM,
      gateway: chirpGateways.INTERNAL
    }));
  } else {
    setDefaultHttpClient(createChirpFetch({
      loadBalancer: loadBalancers.APP,
      gateway: chirpGateways.APP
    }));
  }
}
export const getDefaultHttpClient = () => {
  if (_defaultClient) {
    return _defaultClient;
  }
  if (isHubteamDomain()) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    _defaultClient = require('hub-http-janus/clients/adaptiveIdpAuthApiClient').default;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    _defaultClient = require('hub-http/clients/apiClient').default;
  }
  return _defaultClient;
};
export const __testOnly_resetDefaultHttpClient = () => {
  _defaultClient = undefined;
};