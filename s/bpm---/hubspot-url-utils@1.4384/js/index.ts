import enviro from 'enviro';
import { getSubDomain, getDomain, getTld, getPathPrefix } from './internal';
export function getFullUrl(subDomainPrefix, overrideConfig) {
  const subDomain = getSubDomain(subDomainPrefix, overrideConfig);
  const domain = getDomain(overrideConfig);
  const tld = getTld(overrideConfig);
  const pathPrefix = getPathPrefix(subDomainPrefix);
  return `https://${subDomain}.${domain}.${tld}${pathPrefix}`;
}

/**
 * Generates a full URL based on the current hostname's subdomain and domain.
 * Extracts the subdomain prefix and domain (hubspot/hubteam) from the hostname
 * and constructs a URL using the current environment's hublet settings.
 *
 * @param hostname - The hostname to parse (defaults to window.location.hostname)
 * @returns A fully qualified URL preserving the original domain (hubspot/hubteam)
 *
 * @example
 * // For 'app-eu1.hubspot.com' with hublet 'eu1'
 * getFullUrlWithCurrentSubDomain() // returns 'https://app-eu1.hubspot.com'
 *
 * @example
 * // For 'app.hubteamqa.com' with hublet 'na1', env 'qa'
 * getFullUrlWithCurrentSubDomain() // returns 'https://app.hubteamqa.com'
 *
 * @remarks
 * If hostname doesn't contain a known domain (hubspot, hubspotqa, hubteam, hubteamqa)
 * or has no subdomain, falls back to 'app' (deployed) or 'local' (not deployed).
 */
export function getFullUrlWithCurrentSubDomain(hostname = window.location.hostname) {
  const fallback = enviro.deployed() ? 'app' : 'local';
  if (!hostname) {
    return getFullUrl(fallback);
  }

  // Match: subdomain.domain.tld (domain must be hubspot/hubspotqa/hubteam/hubteamqa)
  const match = hostname.match(/^(.+)\.(hubspot(?:qa)?|hubteam(?:qa)?)\..+$/);
  if (!match) {
    return getFullUrl(fallback);
  }
  const fullSubdomain = match[1];
  const matchedDomain = match[2];
  const baseDomain = matchedDomain.startsWith('hubteam') ? 'hubteam' : 'hubspot';
  const hublet = enviro.getHublet();
  const hubletSuffix = hublet === 'na1' ? '' : `-${hublet}`;
  const prefix = hubletSuffix && fullSubdomain.endsWith(hubletSuffix) ? fullSubdomain.slice(0, -hubletSuffix.length) : fullSubdomain;
  const overrideConfig = baseDomain !== 'hubspot' ? {
    domainOverride: baseDomain
  } : {};
  return getFullUrl(prefix, overrideConfig);
}