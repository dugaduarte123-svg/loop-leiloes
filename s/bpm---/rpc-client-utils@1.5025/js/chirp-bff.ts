import { getGlobal } from './apiClients/global';
import { dispatchRpcRequest } from './chirp-avro-fetch-base';

/**
 * Recursively requires `T` to be JSON-serializable. Any function-typed member is mapped to `never`,
 * so values carrying methods — class instances, `Date`, `Map`/`Set`, or a stray callback — fail to
 * satisfy the constraint and are rejected at compile time. Primitives, arrays, and plain objects pass.
 * Because the object branch is a homomorphic mapped type over `keyof T`, optional properties and
 * interfaces are preserved (unlike a `{ [k: string]: JsonValue }` index type, which rejects both),
 * and `undefined` from an optional property distributes to `never` and drops out cleanly.
 */

/**
 * Controls which namespace scope is applied to a cache entry.
 *
 * - `'BY_BFF'`      — the entry is private to this specific exported BFF function
 *                     (file path + identifier). The most granular scope; two different
 *                     exports in the same file do not share entries.
 * - `'BY_FILE'`     — (default) the entry is shared by all BFFs in the same source file.
 *                     Useful when multiple exports collaborate and should see each other's
 *                     cached results.
 * - any other string — a custom namespace shared by any BFF that uses the same string.
 *                     Useful when two different .bff.ts files intentionally coordinate on
 *                     the same cache key. The caller is responsible for avoiding collisions
 *                     with other BFFs' custom namespaces.
 *
 * `'BY_BFF'` and `'BY_FILE'` are wire-safe — the exact string values are sent to the
 * gateway. Custom strings are sent as-is.
 */

/**
 * Selects which request-derived dimensions namespace a cache entry, plus an optional
 * free-form sub-key. At least one active dimension must be provided — the type enforces
 * this at compile time so an effectively unscoped key (which could produce a
 * portal-crossing singleton) is rejected.
 *
 * portalId/userId are NOT passed here — the gateway fills them from the authenticated
 * request, so a BFF can only read/write entries scoped to the current portal/user
 * (tenant isolation is enforced server-side). By default the entry is also namespaced
 * to the current BFF's source file; see `namespacing`.
 */

/**
 * Best-effort key/value cache backed by memcached.
 *
 * This is a cache, not a store: entries may be evicted at any time (LRU) or lost on a
 * node restart, so `get` can return `undefined` even right after a `set`. Never rely on
 * it for correctness — only to avoid repeat work. Values must be JSON-serializable (the
 * gateway JSON-encodes them) and stay under ~1 MB. Cache failures are swallowed (treated
 * as a miss) so they never fail the BFF.
 */

/**
 * Loosely models available backend rewrites/shims.
 * eg `runtime.client.call(MyRpc, { request: args })` => backend CHIRP call
 */

/**
 * Marker for client-types code generation.
 * BFF calls should use client-types generated bindings.
 */
export function defineBff(_metadata, f) {
  return f;
}
export function deriveAuthFromDomain(hostname) {
  if (/\.hubspot(qa)?\.com$/.test(hostname)) {
    return 'app';
  }
  return 'internal';
}
export function getBffGateway(auth) {
  return `/chirp-bff-${auth}/v1`;
}
export function makeBffCall({
  hubHttpClient,
  details,
  inputs,
  responseParser,
  calledFrom = 'bend',
  rpcFetcherFactory,
  fetcherOverride,
  alternateData
}) {
  var _location$hostname, _location, _inputs$args;
  const auth = deriveAuthFromDomain((_location$hostname = (_location = getGlobal().location) === null || _location === void 0 ? void 0 : _location.hostname) !== null && _location$hostname !== void 0 ? _location$hostname : '');
  const {
    timeout,
    portalId,
    userId,
    environment,
    hublet
  } = inputs !== null && inputs !== void 0 ? inputs : {};
  const request = {
    args: [(_inputs$args = inputs === null || inputs === void 0 ? void 0 : inputs.args) !== null && _inputs$args !== void 0 ? _inputs$args : {}]
  };
  const {
    bffHash,
    name
  } = details;
  const syncStackError = new Error(`BFF call failed for ${bffHash}`);
  const clientTimeout = typeof timeout === 'number' ? timeout : 5000;
  const gatewayUrl = `${getBffGateway(auth)}/execute/hash/${bffHash}/${name}`;
  const data = alternateData !== null && alternateData !== void 0 ? alternateData : dispatchRpcRequest({
    gatewayUrl,
    request,
    headers: {},
    auth,
    clientTimeout,
    environment,
    hublet,
    portalId,
    userId,
    calledFrom,
    hubHttpClient,
    rpcFetcherFactory,
    fetcherOverride
  });
  return data.then(response => {
    if (response != null && typeof response === 'object' && response.isAuthError === true) {
      throw Object.assign(new Error('Unauthorized'), {
        isAuthError: true
      });
    }
    return responseParser ? responseParser(response) : response;
  }).catch(error => {
    syncStackError.cause = error;
    throw syncStackError;
  });
}
export function createBffClient({
  hubHttpClient,
  fetcherOverride,
  rpcFetcherFactory,
  calledFrom
}) {
  return {
    call: (details, inputs, alternateData) => makeBffCall({
      hubHttpClient,
      details,
      inputs,
      calledFrom,
      rpcFetcherFactory,
      fetcherOverride,
      alternateData
    })
  };
}