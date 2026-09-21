import enviro from 'enviro';
import * as PureUrlUtils from './pure-url-utils';
function getHubletToUse(overrideConfig) {
  return overrideConfig && overrideConfig.hubletOverride ? overrideConfig.hubletOverride : enviro.getHublet();
}
function getEnvToUse(overrideConfig) {
  return overrideConfig && overrideConfig.envOverride ? overrideConfig.envOverride : enviro.getShort();
}
export function getHubletPostfix(overrideConfig) {
  const hubletToUse = getHubletToUse(overrideConfig);
  return PureUrlUtils.getHubletPostfix(hubletToUse, overrideConfig);
}
export function getSubDomain(prefix, overrideConfig) {
  const hubletToUse = getHubletToUse(overrideConfig);
  return PureUrlUtils.getSubDomain(hubletToUse, prefix, overrideConfig);
}
export function getDomain(overrideConfig) {
  const hublet = getHubletToUse(overrideConfig);
  const short = getEnvToUse(overrideConfig);
  return PureUrlUtils.getDomain(hublet, short, overrideConfig);
}
export function getEnvPostfix(overrideConfig) {
  const envToUse = getEnvToUse(overrideConfig);
  return PureUrlUtils.getEnvPostfix(envToUse, overrideConfig);
}
export function getDomainPrefix(overrideConfig) {
  return PureUrlUtils.getDomainPrefix(overrideConfig);
}
export function getHubletDomainPostfix(overrideConfig) {
  const hubletToUse = getHubletToUse(overrideConfig);
  return PureUrlUtils.getHubletDomainPostfix(hubletToUse, overrideConfig);
}
export function getTld(overrideConfig) {
  return PureUrlUtils.getTld(overrideConfig);
}
export function getPathPrefix(subDomainPrefix) {
  return PureUrlUtils.getPathPrefix(subDomainPrefix);
}