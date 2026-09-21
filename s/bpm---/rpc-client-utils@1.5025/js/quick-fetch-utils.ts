// Borrowed from: https://git.hubteam.com/HubSpot/apollo-link-hub-http/blob/master/static/js/internal/stableStringify.ts#L1

const stableCopy = value => {
  if (!value || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(stableCopy);
  }
  const keys = Object.keys(value).sort();
  const stable = {};
  for (let i = 0; i < keys.length; i++) {
    stable[keys[i]] = stableCopy(value[keys[i]]);
  }
  return stable;
};
const stableStringify = value => {
  return JSON.stringify(stableCopy(value));
};
const hashCode = s =>
// eslint-disable-next-line no-bitwise
s.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0) | 0, 0);
export const createRequestName = (details, request) => {
  const stableString = stableStringify({
    rpcName: details.rpcName,
    serviceName: details.serviceName,
    fingerprint: details.fingerprint,
    request: request !== null && request !== void 0 ? request : {}
  });
  return hashCode(stableString).toString();
};

/**
 * Computes a deterministic request name for a BFF early request.
 * Hashes `{bffHash, name, args}` — auth is excluded because it is
 * hostname-derived and therefore identical for the early call and the
 * subsequent regular call in the same page load.
 */
export const createBffRequestName = (details, args) => {
  const stableString = stableStringify({
    bffHash: details.bffHash,
    name: details.name,
    args: args !== null && args !== void 0 ? args : {}
  });
  return hashCode(stableString).toString();
};

// ---------------------------------------------------------------------------
// Internal base-URL helpers shared between chirp-quick-fetch.ts and
// chirp-bff-quick-fetch.ts. These are pure string/DOM utilities with no
// external package imports, so they are npm-shim-safe (not reachable from
// npm-shim/index.ts, but safe to import from files that are also outside it).
// ---------------------------------------------------------------------------

const TOOLS_LB_REGEX = /^(?:.*)tools(?:-[^.]+)?\.hubteam/;
const HUBLET_REGEX = /^[^.-]+(-[^.]+)?\.hubteam/;
const HUBTEAM_QA_REGEX = /\.hubteamqa\.com/;
export function getInternalBaseUrlFromHostname(hostname) {
  var _HUBLET_REGEX$exec$, _HUBLET_REGEX$exec;
  const name = TOOLS_LB_REGEX.test(hostname) ? 'tools' : 'private';
  const hubletSuffix = (_HUBLET_REGEX$exec$ = (_HUBLET_REGEX$exec = HUBLET_REGEX.exec(hostname)) === null || _HUBLET_REGEX$exec === void 0 ? void 0 : _HUBLET_REGEX$exec[1]) !== null && _HUBLET_REGEX$exec$ !== void 0 ? _HUBLET_REGEX$exec$ : '';
  const isQa = HUBTEAM_QA_REGEX.test(hostname);
  return `https://${name}${hubletSuffix}.hubteam${isQa ? 'qa' : ''}.com`; // eslint-disable-line
}
export function getBaseUrlForAuth(auth) {
  var _ref, _window$location;
  if (auth === 'app' || auth === 'external') {
    return undefined;
  }
  const hostname = (_ref = typeof window !== 'undefined' ? (_window$location = window.location) === null || _window$location === void 0 ? void 0 : _window$location.hostname : undefined) !== null && _ref !== void 0 ? _ref : '';
  return getInternalBaseUrlFromHostname(hostname);
}
export function getInternalAuthToken() {
  try {
    const matches = document.cookie.match(/(?:^|;\s*)hs_tools_auth_idp=(.*?)(?:;|$)/);
    if (!matches) {
      return null;
    }
    const {
      idptok
    } = JSON.parse(decodeURIComponent(matches[1]));
    return idptok !== null && idptok !== void 0 ? idptok : null;
  } catch (e) {
    return null;
  }
}