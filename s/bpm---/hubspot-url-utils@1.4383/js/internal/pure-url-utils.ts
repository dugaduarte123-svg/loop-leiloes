// Enviro free implementation of `hubspot-url-utils`.

import * as Hublets from '../hublets';
import { Subdomains } from '../subdomains';
export function getHubletPostfix(hublet, overrideConfig) {
  const hasHubletOverride = overrideConfig && overrideConfig.hubletOverride;
  const hubletToUse = hasHubletOverride ? overrideConfig.hubletOverride : hublet;
  const hubletizeNa1 = overrideConfig && overrideConfig.hubletizeNa1 === true;
  if (hubletToUse === Hublets.na1 && !hubletizeNa1) {
    return '';
  }
  return `-${hubletToUse}`;
}
export function getSubDomain(hublet, prefix, overrideConfig) {
  const hasHubletPostfixOverride = overrideConfig && overrideConfig.hubletPostfixLocation && overrideConfig.hubletPostfixLocation === 'domain';
  if (hasHubletPostfixOverride) {
    return prefix;
  }
  if (prefix === Subdomains.APP_API) {
    prefix = Subdomains.APP;
  }
  return `${prefix}${getHubletPostfix(hublet, overrideConfig)}`;
}
export function getDomain(hublet, short, overrideConfig) {
  const domainPrefix = getDomainPrefix(overrideConfig);
  const envPostfix = getEnvPostfix(short, overrideConfig);
  const hubletDomainPostfix = getHubletDomainPostfix(hublet, overrideConfig);
  return `${domainPrefix}${envPostfix}${hubletDomainPostfix}`;
}
export function getEnvPostfix(short, overrideConfig) {
  const hasEnvOverride = overrideConfig && overrideConfig.envOverride;
  const envToUse = hasEnvOverride ? overrideConfig.envOverride : short;
  if (envToUse === 'qa') {
    return 'qa';
  }
  return '';
}
export function getDomainPrefix(overrideConfig) {
  const hasDomainOverride = overrideConfig && overrideConfig.domainOverride;
  if (hasDomainOverride) {
    return overrideConfig.domainOverride;
  }
  return 'hubspot';
}
export function getHubletDomainPostfix(hublet, overrideConfig) {
  const hasHubletPostfixxOverride = overrideConfig && overrideConfig.hubletPostfixLocation && overrideConfig.hubletPostfixLocation === 'domain';
  if (!hasHubletPostfixxOverride) {
    return '';
  }
  return getHubletPostfix(hublet, overrideConfig);
}
export function getTld(overrideConfig) {
  const hasTldOverride = overrideConfig && overrideConfig.tldOverride;
  if (hasTldOverride) {
    return overrideConfig.tldOverride;
  }
  return 'com';
}
export function getPathPrefix(subDomainPrefix) {
  if (subDomainPrefix === Subdomains.APP_API) {
    return '/api';
  }
  return '';
}