import { getHsLocaleHeader } from 'hs-locale-management';
import { chirpGateways } from './constants';
import { getCookie } from './middleware/util/cookies';
import { getIdpAuthHeaders } from './middleware/idpAuth';

/**
 * Get the standard headers for a given Chirp Gateway type.
 *
 * TODO: Some cookie logic is duplicated in hub-http, quick-fetch and elsewhere. It should be centralized.
 */
export function getStandardHeaders(gateway, cookie) {
  const headers = {
    'Content-Type': 'application/json'
  };
  switch (gateway) {
    case chirpGateways.APP:
      {
        const csrfToken = getCookie('csrf.app', cookie);
        if (csrfToken) {
          headers['X-HubSpot-CSRF-hubspotapi'] = csrfToken;
        }
        Object.assign(headers, getHsLocaleHeader());
        break;
      }
    case chirpGateways.TEST:
    case chirpGateways.INTERNAL:
      {
        // INTERNAL/TEST is idp-bearer auth; reuse the standalone withIdpAuth
        // implementation so there is one source of truth for the idp header.
        Object.assign(headers, getIdpAuthHeaders(cookie));
        break;
      }
    case chirpGateways.EXTERNAL:
      // For external gateway, don't add any HubSpot auth headers
      break;
    default:
  }
  return headers;
}