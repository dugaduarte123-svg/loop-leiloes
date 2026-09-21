import { getCookie } from './util/cookies';
import { mergeHeaders } from './util/mergeHeaders';

/**
 * Resolve the internal IdP `Authorization: Bearer` header from the
 * `hs_tools_auth_idp` cookie. Shared by `withIdpAuth` and the INTERNAL/TEST
 * gateway path in `getStandardHeaders`, so there is a single implementation.
 * Returns an empty object when the cookie is absent or unparseable.
 *
 * `getCookie` already URL-decodes once, matching hub-http-janus'
 * `idpCookieAuth` (which decodes the raw cookie once before `JSON.parse`).
 */
export function getIdpAuthHeaders(cookie) {
  const idpCookie = getCookie('hs_tools_auth_idp', cookie);
  if (!idpCookie) {
    return {};
  }
  try {
    const {
      idptok
    } = JSON.parse(idpCookie);
    return idptok ? {
      Authorization: `Bearer ${idptok}`
    } : {};
  } catch (_unused) {
    return {};
  }
}

/**
 * Standalone middleware that attaches HubSpot's internal IdP bearer token
 * (from the `hs_tools_auth_idp` cookie) as `Authorization: Bearer <idptok>`.
 *
 * Host-independent: unlike chirp-fetch's INTERNAL gateway — which couples this
 * auth to a specific gateway/host — this can be applied to a request against
 * any host by a consumer that picks auth type per request. No-op when the
 * cookie is absent or unparseable; never clobbers an existing Authorization
 * header.
 */
export const withIdpAuth = (params, context) => mergeHeaders(params, getIdpAuthHeaders(context.cookie));