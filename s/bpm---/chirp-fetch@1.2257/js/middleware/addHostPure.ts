import { getFullUrlPure } from 'hubspot-url-utils/pure';
import { chirpGateways, loadBalancers } from '../constants';
import enviro from '../util/enviro';
/**
 * Middleware that ensures URLs are absolute using hubspot-url-utils.
 * The URL constructor automatically handles both relative and absolute URLs:
 * - Relative URLs are resolved against the base URL
 * - Absolute URLs are used as-is (the base is ignored)
 */
export const addHostPure = (params, context) => {
  const inputStr = params.input.toString();
  const useLongLivedLb = context.useLongLivedLb;
  if (useLongLivedLb && context.loadBalancer === loadBalancers.GLOBAL) {
    throw new Error('useLongLivedLb is not supported with GLOBAL load balancer');
  }
  const isLocal = inputStr === null || inputStr === void 0 ? void 0 : inputStr.includes('chirp-frontend-local');
  const longLivedAppAuthBaseUrl = getFullUrlPure(isLocal ? 'local' : 'chirp-stream-app', context.hublet || enviro.getHublet(), context.env || enviro.getShort(), {
    domainOverride: 'hubspot',
    hubletizeNa1: !isLocal
  });
  const longLivedinternalAuthBaseUrl = getFullUrlPure(isLocal ? 'local' : 'chirp-stream-internal', context.hublet || enviro.getHublet(), context.env || enviro.getShort(), {
    domainOverride: 'hubteam',
    hubletizeNa1: !isLocal
  });
  const longLivedExternalAuthBaseUrl = getFullUrlPure(isLocal ? 'local' : 'chirp-stream-external', context.hublet || enviro.getHublet(), context.env || enviro.getShort(), {
    domainOverride: 'hubspot',
    hubletizeNa1: !isLocal
  });
  const getLongLivedBaseUrl = () => {
    if (context.loadBalancer === loadBalancers.APP) {
      return context.gateway === chirpGateways.EXTERNAL ? longLivedExternalAuthBaseUrl : longLivedAppAuthBaseUrl;
    }
    return longLivedinternalAuthBaseUrl;
  };

  // If already an absolute URL, return with string input
  // This should never happen for on stack streaming CHIRP RPCs
  if (inputStr.startsWith('http://') || inputStr.startsWith('https://')) {
    if (useLongLivedLb) {
      try {
        const url = new URL(inputStr);
        const pathname = url.pathname;
        return Object.assign({}, params, {
          input: `${getLongLivedBaseUrl()}${pathname}`
        });
      } catch (error) {
        // TODO: Probably log this but it should never happen
        return Object.assign({}, params, {
          input: inputStr
        });
      }
    }
    return Object.assign({}, params, {
      input: inputStr
    });
  }

  // Map our load balancer constants to hubspot-url-utils subdomain strings
  let baseUrl;
  if (useLongLivedLb) {
    baseUrl = getLongLivedBaseUrl();
  } else {
    switch (context.loadBalancer) {
      case loadBalancers.APP:
        // Use 'app-api' which includes the /api path for app.hubspot.com
        baseUrl = getFullUrlPure('app-api', context.hublet || enviro.getHublet(), context.env || enviro.getShort());
        break;
      case loadBalancers.TOOLS:
        // For tools.hubteam.com
        baseUrl = getFullUrlPure('tools', context.hublet || enviro.getHublet(), context.env || enviro.getShort(), {
          domainOverride: 'hubteam'
        });
        break;
      case loadBalancers.PRIVATEHUBTEAM:
        // 'privatehubteam'
        // For private.hubteam.com

        baseUrl = getFullUrlPure('private', context.hublet || enviro.getHublet(), context.env || enviro.getShort(), {
          domainOverride: 'hubteam'
        });
        break;
      case loadBalancers.GLOBAL:
        // Single global host for all hublets: chirp-global.hubspot(qa).com.
        // The hubletOverride pins the hublet to na1 so the host has no
        // hublet suffix. Importing the `na1` constant from
        // 'hubspot-url-utils/hublets' is not an option: that subpath is a
        // DLB and chirp-fetch is consumed by early-requester scripts
        // inlined above DLB script tags (PR #38 was reverted in #39 for
        // exactly this reason).
        baseUrl = getFullUrlPure('chirp-global', context.hublet || enviro.getHublet(), context.env || enviro.getShort(),
        // eslint-disable-next-line hubspot-dev/no-hublet-references
        {
          hubletOverride: 'na1'
        });
        break;
      default:
        throw new Error(`Unknown load balancer: ${context.loadBalancer}`);
    }
  }

  // Parse the base URL to get origin and pathname
  const {
    origin,
    pathname
  } = new URL(baseUrl);

  // assumes inputStr starts with a slash, and pathname will either be "/", or start but not end with a slash ("/api")
  let finalPath = pathname + inputStr;
  if (finalPath.startsWith('//')) {
    finalPath = finalPath.slice(1);
  }
  const url = new URL(finalPath, origin);
  return Object.assign({}, params, {
    input: url.toString()
  });
};