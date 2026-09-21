import { getFetch } from './global';
const CHIRP_GATEWAY_LOCAL_PROXY = 'chirp-gateway-local-proxy';
const fetch = getFetch();
async function fetchBenderProxyConfig() {
  if (typeof fetch !== 'undefined' && typeof fetch === 'function') {
    try {
      const resp = await fetch('https://localhost/bender-proxy/config', {
        // internal app, nobody is using safari 11
        // eslint-disable-next-line compat/compat
        signal: AbortSignal.timeout(1000)
      });
      return await resp.json();
    } catch (error) {
      console.error('Error fetching bender proxy config:', error);
      return Promise.resolve({
        applied: []
      });
    }
  }
  return Promise.resolve({
    applied: []
  });
}
export async function describeLocalChirpServer(appRoot, workspace) {
  // hubspotqa.com is used for the describe probe regardless of service auth type.
  // bender-proxy's {bendInstanceHost} pattern is domain-agnostic, so both
  // hubspotqa.com and hubteamqa.com route to the same workspace-bound service.
  // The domain used here does not need to match getLocalAvroGateway's auth-based
  // selection — only the workspace subdomain prefix matters for routing.
  const host = workspace ? `${workspace}.local.hubspotqa.com` : 'localhost';
  const url = `https://${host}${appRoot}/_chirp/_describe`;
  if (typeof fetch !== 'undefined' && typeof fetch === 'function') {
    try {
      const resp = await fetch(url, {
        signal: AbortSignal.timeout(1000)
      });
      if (resp.ok) {
        return await resp.json();
      } else {
        // Not a chirp service
        return Promise.resolve({
          serviceNames: [],
          authType: 'internal'
        });
      }
    } catch (error) {
      console.error('Error fetching local chirp server:', error);
      return Promise.resolve({
        serviceNames: [],
        authType: 'internal'
      });
    }
  }
  return Promise.resolve({
    serviceNames: [],
    authType: 'internal'
  });
}
export async function fetchLocalServices() {
  const {
    applied
  } = await fetchBenderProxyConfig();
  const dwConfigs = applied.filter(conf => conf.config.path[0] === 'dropwizard' && conf.config.name !== CHIRP_GATEWAY_LOCAL_PROXY);
  const localChirpServicePromises = dwConfigs.map(async conf => {
    const appRoot = conf.config.routes[0].appRoot;
    const workspace = conf.config.bendInstance;
    const {
      serviceNames
    } = await describeLocalChirpServer(appRoot, workspace);
    return serviceNames.map(name => ({
      name,
      appRoot,
      workspace
    }));
  });
  const results = await Promise.allSettled(localChirpServicePromises);
  return results.filter(result => result.status === 'fulfilled').flatMap(result => result.value);
}