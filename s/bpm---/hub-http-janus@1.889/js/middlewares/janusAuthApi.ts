// @ts-ignore Upstream dependency
import { redirectTo } from 'hub-http/helpers/location';
import * as params from 'hub-http/helpers/params';
// @ts-ignore Upstream dependency
import { responseError } from 'hub-http/helpers/response';
import { buildUrl } from 'hub-http/helpers/url';
import { onResponse } from 'hub-http/middlewares/core';
import { isAuthMocked } from 'hub-http/helpers/authMocked';
import enviro from 'enviro';
const defaultOptions = {
  method: 'GET',
  withCredentials: true,
  timeout: 7000
};
export const defaults = options => Object.assign({}, defaultOptions, options);
export function getLocation() {
  return window.location.href;
}
export const buildLogoutUrl = options => {
  const hostname = enviro.isQa() ? /* eslint-disable-next-line hubspot-dev/prefer-hubspot-url-utils */
  'private.hubteamqa.com' : /* eslint-disable-next-line hubspot-dev/prefer-hubspot-url-utils */
  'private.hubteam.com';
  const loginDescriptor = {
    hostname,
    path: '/prodlogin/',
    query: params.stringify({
      next: options.location.href
    })
  };
  return buildUrl(loginDescriptor);
};
const handleLogout = response => {
  const {
    options
  } = response;
  const redirectUrl = buildLogoutUrl(options);
  return redirectTo(redirectUrl, options) ? Promise.reject(responseError(response, 'Aborting: redirection in progress')) : response;
};
export const logoutOn = predicate => options => {
  if (isAuthMocked(options)) {
    return options;
  }
  return onResponse(response => {
    return predicate(response) ? handleLogout(response) : response;
  })(options);
};
const KUBERNETES_DOMAIN_REGEX = /\.k8s\.run$/i;
export const isKubernetesDomain = domain => {
  return KUBERNETES_DOMAIN_REGEX.test(domain);
};
const HUBTEAM_DOMAIN_REGEX = /\.hubteam(qa)?\.com$/i;
export const isHubteamDomain = domain => {
  return HUBTEAM_DOMAIN_REGEX.test(domain);
};
const HUBAPI_DOMAIN_REGEX = /\.hubapi(qa)?\.com$/i;
export const isHubApiDomain = domain => {
  return HUBAPI_DOMAIN_REGEX.test(domain);
};
export const logoutOnUnauthorized = logoutOn(response => response.status === 401);