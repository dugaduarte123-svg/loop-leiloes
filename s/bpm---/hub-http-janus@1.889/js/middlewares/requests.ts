import { parseUrl } from 'hub-http/helpers/url';
import { isAuthMocked } from 'hub-http/helpers/authMocked';
// @ts-ignore Upstream dependency
import { set } from 'hub-http/helpers/update';
export const maybeUseIframeRequest = options => {
  if (isAuthMocked(options)) {
    return options;
  }
  const {
    hostname
  } = parseUrl(options.url);
  const useIframeRequest = hostname.startsWith('private.hubteam');
  return set('useIframeRequest', useIframeRequest)(options);
};