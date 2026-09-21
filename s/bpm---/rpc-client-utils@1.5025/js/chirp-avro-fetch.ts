import { getGlobal } from './apiClients/global';
import { makeChirpAvroCall as _makeChirpAvroCall } from './chirp-avro-fetch-base';

// Lazy-loaded chirp-fetch module. Loaded on first use to avoid pulling in
// browser-only code (current-package-loader!) in Node.js environments such
// as acceptance-test runners.
let _chirpFetch;
function getChirpFetch() {
  if (!_chirpFetch) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _chirpFetch = require('chirp-fetch');
  }
  return _chirpFetch;
}
const TOOLS_DOMAIN_REGEX = /^(?:.*)tools(?:-[^.]+)?\.hubteam/;
function getInternalLoadBalancer() {
  var _location$href, _location;
  const {
    loadBalancers
  } = getChirpFetch();
  const location = (_location$href = (_location = getGlobal().location) === null || _location === void 0 ? void 0 : _location.href) !== null && _location$href !== void 0 ? _location$href : '';
  return TOOLS_DOMAIN_REGEX.test(location) ? loadBalancers.TOOLS : loadBalancers.PRIVATEHUBTEAM;
}
let rpcFetcherCache;
export function getRpcFetcher(auth, env, hublet) {
  const {
    createChirpFetch,
    loadBalancers,
    chirpGateways
  } = getChirpFetch();
  if (!rpcFetcherCache) {
    rpcFetcherCache = new Map();
  }
  const isAppAuth = auth === 'app' || auth === 'external';
  const loadBalancer = isAppAuth ? loadBalancers.APP : getInternalLoadBalancer();
  const cacheKey = `${auth}:${env !== null && env !== void 0 ? env : ''}:${hublet !== null && hublet !== void 0 ? hublet : ''}:${loadBalancer}`;
  if (!rpcFetcherCache.has(cacheKey)) {
    rpcFetcherCache.set(cacheKey, createChirpFetch({
      loadBalancer,
      gateway: auth,
      env: env,
      hublet
    }));
  }
  return rpcFetcherCache.get(cacheKey);
}
export async function makeChirpAvroCall(args) {
  return await _makeChirpAvroCall(Object.assign({}, args, {
    rpcFetcherFactory: getRpcFetcher
  }));
}