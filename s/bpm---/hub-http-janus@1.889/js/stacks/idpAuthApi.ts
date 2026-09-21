import { createStack } from 'hub-http';
import * as core from 'hub-http/middlewares/core';
// @ts-ignore Upstream dependency
import * as debug from 'hub-http/middlewares/debug';
import * as janusAuthApi from '../middlewares/janusAuthApi';
import * as loadBalancers from '../middlewares/loadBalancers';
import idpCookieAuth, { idpLogoutOnUnauthorized } from '../middlewares/idpCookieAuth';
import { maybeUseIframeRequest } from '../middlewares/requests';
import { isHubteamDomain, isKubernetesDomain, isHubApiDomain } from '../middlewares/janusAuthApi';
import { parseUrl } from 'hub-http/helpers/url';
import { isAuthMocked } from 'hub-http/helpers/authMocked';
import { dynamicEnvHubletConfig } from '../middlewares/envHubletConfig';
export const createIdpAuthStack = lbMiddleware => createStack(core.services, core.validateOptions(options => {
  const urlHostname = parseUrl(options.url).hostname;
  return isAuthMocked(options) || !urlHostname || isHubteamDomain(urlHostname) || isKubernetesDomain(urlHostname) || isHubApiDomain(urlHostname);
}, 'You are currently attempting to make a IDP authorization request to an unsupported domain. IDP auth is only supported on *.hubteam(qa).com domains.'), core.validateOptions(options => isAuthMocked(options) || isHubteamDomain(options.location.hostname), 'You are currently attempting to make a IDP authorization request from an unsupported domain. IDP auth is only supported on *.hubteam(qa).com domains.'), dynamicEnvHubletConfig, janusAuthApi.defaults, core.jsonBody, core.httpsOnly, lbMiddleware, maybeUseIframeRequest, idpCookieAuth, core.withQuery, debug.rewriteUrl, core.reportOptionsError, idpLogoutOnUnauthorized, core.validateStatus, core.jsonResponse);

// take the stack of middleware and create a promise based REST-ful client.
export const idpAuthStack = createIdpAuthStack(loadBalancers.privateApi);