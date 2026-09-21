import { parseUrl } from 'hub-http/helpers/url';
import { getLocation } from './janusAuthApi';
import enviro from 'enviro';

/**
 * Extracts service name, hublet, and environment info from a given URL
 */
export const inferCurrentEnvironmentInfo = url => {
  const {
    hostname = ''
  } = parseUrl(url);

  // Match pattern: {featureName}.local.[some-lb].{domainPrefix}{qa?}.com
  const localFeatureBranchMatch = hostname.match(/^([^.]+)\.local\.([^.]+)\.([^.]+?)(qa)?\.com$/);
  if (localFeatureBranchMatch) {
    const [,, serviceName, domainPrefix] = localFeatureBranchMatch;
    return {
      serviceName,
      domainPrefix,
      hublet: '',
      env: enviro.isQa() ? 'qa' : 'prod'
    };
  }

  // Match pattern: {serviceName}{-hublet}.{domainPrefix}{qa?}.com
  const match = hostname.match(/^([^.]+)\.([^.]+?)(qa)?\.com$/);
  if (!match) {
    return {
      serviceName: 'private',
      domainPrefix: 'hubteam',
      hublet: '',
      env: enviro.isQa() ? 'qa' : 'prod'
    };
  }
  const [, serviceAndHublet, domainPrefix] = match;

  // Split service name and hublet - hublet is the last hyphenated part
  const lastHyphenIndex = serviceAndHublet.lastIndexOf('-');
  let serviceName;
  let hublet;
  if (lastHyphenIndex === -1) {
    // No hublet
    serviceName = serviceAndHublet;
    hublet = '';
  } else {
    serviceName = serviceAndHublet.substring(0, lastHyphenIndex);
    hublet = serviceAndHublet.substring(lastHyphenIndex + 1);
  }
  return {
    serviceName: serviceName === 'local' ? 'private' : serviceName,
    domainPrefix,
    hublet,
    env: enviro.isQa() ? 'qa' : 'prod'
  };
};

/**
 * Creates a hublet API configuration based on options
 */
const createHubletApiFromOptions = ({
  name,
  domainPrefix,
  hubletOverride,
  envOverride
}) => {
  const targetHublet = hubletOverride ? `-${hubletOverride}` : '';
  const suffix = envOverride === 'qa' ? 'qa' : '';
  return {
    local: {
      qa: `local${targetHublet}.${domainPrefix}${suffix}.com`,
      prod: `local${targetHublet}.${domainPrefix}${suffix}.com`
    },
    deployed: {
      qa: `${name}${targetHublet}.${domainPrefix}${suffix}.com`,
      prod: `${name}${targetHublet}.${domainPrefix}${suffix}.com`
    }
  };
};

/**
 * Middleware that checks for env/hublet options in the request options
 * and dynamically configures the URL accordingly
 */
export const dynamicEnvHubletConfig = options => {
  // Check if env/hublet options are provided
  const configuredEnvironment = options.environment;
  const configuredHublet = options.hublet;
  if (!configuredEnvironment && !configuredHublet) {
    // No special configuration, pass through unchanged
    return options;
  }
  try {
    // Infer current environment info from the page location
    const currentEnv = inferCurrentEnvironmentInfo(getLocation());
    const hubletApi = createHubletApiFromOptions({
      name: currentEnv.serviceName,
      domainPrefix: currentEnv.domainPrefix,
      hubletOverride: configuredHublet || currentEnv.hublet,
      envOverride: configuredEnvironment || currentEnv.env
    });
    const updatedOptions = Object.assign({}, options, {
      api: hubletApi
    });
    return updatedOptions;
  } catch (e) {
    return options;
  }
};