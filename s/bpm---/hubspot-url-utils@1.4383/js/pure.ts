import { getSubDomain, getDomain, getTld, getPathPrefix } from './internal/pure-url-utils';

/**
 * Enviro-less version of getFullUrl
 */
export function getFullUrlPure(subDomainPrefix, hublet, environment, overrideConfig) {
  const subDomain = getSubDomain(hublet, subDomainPrefix, overrideConfig);
  const domain = getDomain(hublet, environment, overrideConfig);
  const tld = getTld(overrideConfig);
  const pathPrefix = getPathPrefix(subDomainPrefix);
  return `https://${subDomain}.${domain}.${tld}${pathPrefix}`;
}