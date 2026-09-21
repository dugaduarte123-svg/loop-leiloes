import { createStack } from 'hub-http';
import { header, onResponse } from 'hub-http/middlewares/core';
// @ts-ignore Upstream dependency
import { getCookie } from 'hub-http/helpers/cookies';
import { isAuthMocked } from 'hub-http/helpers/authMocked';
import * as params from 'hub-http/helpers/params';
import { buildUrl } from 'hub-http/helpers/url';
// @ts-ignore Upstream dependency
import { redirectTo } from 'hub-http/helpers/location';
// @ts-ignore Upstream dependency
import { responseError } from 'hub-http/helpers/response';
import enviro from 'enviro';

// the JSON Web Token set by the internal tools login login
function getJwt(options) {
  const idpAuthCookie = getCookie('hs_tools_auth_idp', options.cookies);
  if (!idpAuthCookie) {
    return null;
  }
  return JSON.parse(decodeURIComponent(idpAuthCookie));
}
export const getUsername = () => {
  const jwt = getJwt({
    cookies: document.cookie
  });
  return jwt ? jwt.uid : null;
};
function getAuthHeader(options) {
  const idpAuthCookie = getJwt(options);
  return idpAuthCookie ? `Bearer ${idpAuthCookie.idptok}` : null;
}
export const buildIdpLogoutUrl = options => {
  const hostname = enviro.isQa() ? /* eslint-disable-next-line hubspot-dev/prefer-hubspot-url-utils */
  'tools.hubteamqa.com' : /* eslint-disable-next-line hubspot-dev/prefer-hubspot-url-utils */
  'tools.hubteam.com';
  const loginDescriptor = {
    hostname,
    path: 'login',
    query: params.stringify({
      next: options.location.href
    })
  };
  return buildUrl(loginDescriptor);
};
const handleIdpLogout = response => {
  const {
    options
  } = response;
  const redirectUrl = buildIdpLogoutUrl(options);
  return redirectTo(redirectUrl, options) ? Promise.reject(responseError(response, 'Aborting: redirection in progress')) : response;
};
export const idpLogoutOn = predicate => options => {
  if (isAuthMocked(options)) {
    return options;
  }
  return onResponse(response => {
    return predicate(response) ? handleIdpLogout(response) : response;
  })(options);
};
export const logoutOnMissingAuthHeader = options => idpLogoutOn(() => !getAuthHeader(options))(options);

// Custom logout handler for IDP that redirects to tools login on 401
export const idpLogoutOnUnauthorized = options => {
  return idpLogoutOn(response => response.status === 401)(options);
};
export const withAuthHeader = options => {
  if (isAuthMocked(options)) {
    return options;
  }
  const authHeader = getAuthHeader(options);
  return authHeader ? header('Authorization', authHeader, false)(options) : options;
};
export default createStack(logoutOnMissingAuthHeader, withAuthHeader);