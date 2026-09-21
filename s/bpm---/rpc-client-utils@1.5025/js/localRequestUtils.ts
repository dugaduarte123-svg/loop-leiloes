import { fetchLocalServices } from './apiClients/LocalhostApi';
import { getSessionStorage, getGlobal } from './apiClients/global';
export const CHIRP_SKIP_LOCAL_KEY = 'CHIRP_SKIP_LOCAL';
export const CHIRP_FORCE_401_KEY = 'CHIRP_FORCE_401';
// Devtools extension writes this key to steer all local CHIRP calls to a
// specific workspace without requiring a URL change.
// null  = explicitly route to the no-workspace service
// string = explicitly route to that workspace
// (key absent) = defer to hostname-based routing
export const CHIRP_LOCAL_WORKSPACE_KEY = 'CHIRP_LOCAL_WORKSPACE';

// Extracts the workspace prefix from a local dev hostname.
// e.g. 'left.local.hubteamqa.com' → 'left', 'local.hubapiqa.com' → undefined
/** @visibleForTesting */
export function getWorkspaceFromHostname() {
  try {
    var _global$location$host, _global$location;
    const global = getGlobal();
    const hostname = (_global$location$host = (_global$location = global.location) === null || _global$location === void 0 ? void 0 : _global$location.hostname) !== null && _global$location$host !== void 0 ? _global$location$host : '';
    const labels = hostname.split('.');
    if (labels.length >= 4 && (labels[1] === 'local' || labels[1].startsWith('local-')) && /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(labels[0])) {
      return labels[0];
    }
    return undefined;
  } catch (_unused) {
    return undefined;
  }
}
let localServicesPromise = null;

// we aren't allowed enviro here due to npm-shim constraints
function matchesLocation(hostnamePattern, pathPrefix) {
  try {
    const global = getGlobal();
    if (!global.location) {
      return false;
    }
    const {
      hostname,
      pathname
    } = global.location;
    return hostnamePattern.test(hostname) && (pathPrefix === undefined || pathname.startsWith(pathPrefix));
  } catch (_unused2) {
    return false;
  }
}
function isQA() {
  return matchesLocation(/qa\./);
}
function isGoggles() {
  return matchesLocation(/(tools|private|local)\.hubteam(qa)?\.com/, '/api');
}
function isLocalStatic() {
  return matchesLocation(/(^|\.)local\.hsappstatic\.net$/);
}
function getSessionStorageFlag(key) {
  const sessionStorage = getSessionStorage();
  if (!sessionStorage || typeof sessionStorage.getItem !== 'function') {
    return false;
  }
  try {
    return sessionStorage.getItem(key) === 'true';
  } catch (_unused3) {
    return false;
  }
}
function getSkipLocalValue() {
  try {
    var _getSessionStorage;
    const raw = (_getSessionStorage = getSessionStorage()) === null || _getSessionStorage === void 0 ? void 0 : _getSessionStorage.getItem(CHIRP_SKIP_LOCAL_KEY);
    if (!raw) return null;
    if (raw === 'true') return true;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every(i => typeof i === 'string') ? parsed : null;
  } catch (_unused4) {
    return null;
  }
}
function shouldSkipLocal(serviceName) {
  const value = getSkipLocalValue();
  if (value === true) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.includes(serviceName);
  }
  return false;
}

// Returns the workspace override from sessionStorage:
//   undefined → key absent, fall through to hostname routing
//   null      → key present and empty, route to no-workspace service
//   string    → key present, route to that workspace
function getSessionStorageWorkspace() {
  try {
    var _getSessionStorage2;
    const raw = (_getSessionStorage2 = getSessionStorage()) === null || _getSessionStorage2 === void 0 ? void 0 : _getSessionStorage2.getItem(CHIRP_LOCAL_WORKSPACE_KEY);
    if (raw === null) return undefined;
    if (raw === '') return null;
    return raw;
  } catch (_unused5) {
    return undefined;
  }
}
function fetchLocalServicesCached() {
  if (!localServicesPromise) {
    localServicesPromise = fetchLocalServices().catch(() => []);
  }
  return localServicesPromise;
}

/** Resets the local-services cache so the next call re-discovers running services. */
export function resetLocalServicesCache() {
  localServicesPromise = null;
}
export async function resolveLocalRequest(serviceName, explicitLocalWorkspace) {
  const isAllowedHost = isQA() || isGoggles() || isLocalStatic();
  if (!isAllowedHost) {
    return null;
  }
  if (shouldSkipLocal(serviceName)) {
    return null;
  }
  try {
    const services = await fetchLocalServicesCached();
    const matching = services.filter(s => s.name === serviceName);

    // Explicit code-level override (Goggles): exact-match only, no fallback.
    if (explicitLocalWorkspace !== undefined) {
      var _ref;
      return (_ref = explicitLocalWorkspace !== null ? matching.find(s => s.workspace === explicitLocalWorkspace) : matching.find(s => !s.workspace)) !== null && _ref !== void 0 ? _ref : null;
    }

    // Step 1: Is the service running locally at all (any workspace)?
    if (matching.length === 0) return null;

    // Step 2: Determine gateway workspace.
    //   a. sessionStorage key set → use it directly (null = no-workspace gateway)
    //   b. hostname workspace running (has any services) → use it
    //   c. otherwise → no-workspace gateway (local.{domain}.com)
    const sessionWorkspace = getSessionStorageWorkspace();
    let gatewayWorkspace;
    if (sessionWorkspace !== undefined) {
      gatewayWorkspace = sessionWorkspace === null ? undefined : sessionWorkspace;
    } else {
      const hostnameWorkspace = getWorkspaceFromHostname();
      gatewayWorkspace = hostnameWorkspace && services.some(s => s.workspace === hostnameWorkspace) ? hostnameWorkspace : undefined;
    }

    // Step 3: Find the service at the determined gateway.
    const serviceInGateway = gatewayWorkspace !== undefined ? matching.find(s => s.workspace === gatewayWorkspace) : matching.find(s => !s.workspace);
    if (serviceInGateway) return serviceInGateway;

    // Step 4: When routing via a hostname workspace gateway, also check for a
    // no-workspace instance of the service as a fallback — the workspace gateway
    // can proxy to non-workspace backends via bender-proxy.
    // (FE on workspace URL, BE running without a workspace.)
    // Skip for session storage overrides: explicit choice = no silent fallback.
    if (sessionWorkspace === undefined && gatewayWorkspace !== undefined) {
      const noWorkspaceFallback = matching.find(s => !s.workspace);
      if (noWorkspaceFallback) {
        return Object.assign({}, noWorkspaceFallback, {
          workspace: gatewayWorkspace
        });
      }
    }
    return null;
  } catch (_unused6) {
    return null;
  }
}
export function shouldForce401() {
  return getSessionStorageFlag(CHIRP_FORCE_401_KEY);
}