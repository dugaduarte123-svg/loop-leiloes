import { environmentUrl } from 'hub-http/middlewares/core';
import enviro from 'enviro';
import { getLocation } from './janusAuthApi';

// eslint-disable-next-line hubspot-dev/no-hublet-references
const NA1_REGEX = /^(?:.*)(-na1).(?:hubteam(qa)?).com/;
const TOOLS_REGEX = /^(?:.*)tools(?:-[^.]+)?\.hubteam/;
export const janusHubletApi = (name, domainPrefix, hubletOverride) => {
  const targetHublet = enviro.ifHublet({
    isNa1: hublet => {
      // On private LBs we allow `-na1` suffixes in URLs.
      const explicitNa1 = NA1_REGEX.test(getLocation());
      return explicitNa1 ? `-${hublet}` : '';
    },
    isNonNa1: hublet => `-${hublet}`
  }, hubletOverride);
  return {
    local: {
      qa: `local${targetHublet}.${domainPrefix}qa.com`,
      prod: `local${targetHublet}.${domainPrefix}.com`
    },
    deployed: {
      qa: `${name}${targetHublet}.${domainPrefix}qa.com`,
      prod: `${name}${targetHublet}.${domainPrefix}.com`
    }
  };
};
export const privateApi = environmentUrl(janusHubletApi('private', 'hubteam'));
export const toolsApi = environmentUrl(janusHubletApi('tools', 'hubteam'));
export const getAdaptiveIdpHubletApi = hubletOverride => {
  const isToolsRequest = () => {
    const location = getLocation();
    // Check for tools domain (e.g., tools.hubteam.com, tools.hubteamqa.com, tools-eu1.hubteam.com)
    return TOOLS_REGEX.test(location);
  };
  return isToolsRequest() ? janusHubletApi('tools', 'hubteam', hubletOverride) : janusHubletApi('private', 'hubteam', hubletOverride);
};
export const adaptiveIdpApi = environmentUrl(getAdaptiveIdpHubletApi());