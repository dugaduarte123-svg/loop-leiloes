"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFullUrl = getFullUrl;
exports.getFullUrlWithCurrentSubDomain = getFullUrlWithCurrentSubDomain;
var _enviro = _interopRequireDefault(require("enviro"));
var _internal = require("./internal");
function getFullUrl(subDomainPrefix, overrideConfig) {
  const subDomain = (0, _internal.getSubDomain)(subDomainPrefix, overrideConfig);
  const domain = (0, _internal.getDomain)(overrideConfig);
  const tld = (0, _internal.getTld)(overrideConfig);
  const pathPrefix = (0, _internal.getPathPrefix)(subDomainPrefix);
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
function getFullUrlWithCurrentSubDomain(hostname = window.location.hostname) {
  const fallback = _enviro.default.deployed() ? 'app' : 'local';
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
  const hublet = _enviro.default.getHublet();
  const hubletSuffix = hublet === 'na1' ? '' : `-${hublet}`;
  const prefix = hubletSuffix && fullSubdomain.endsWith(hubletSuffix) ? fullSubdomain.slice(0, -hubletSuffix.length) : fullSubdomain;
  const overrideConfig = baseDomain !== 'hubspot' ? {
    domainOverride: baseDomain
  } : {};
  return getFullUrl(prefix, overrideConfig);
}