import { getFullUrl } from 'hubspot-url-utils';
//@ts-ignore untyped-file
import { bender } from 'legacy-hubspot-bender-context';
import { getChatflowTagFromQueryParams } from '../utils/getChatflowTagFromQueryParams';
import { getPortalIdFromPath } from '../utils/getPortalIdFromPath';
import { isAnyMobile } from '../utils/whichDevice';
export function getInternalRequestUrl({
  messagesEnv,
  portalId,
  messagesUtk,
  messagesHublet
}) {
  const usersPortalId = getPortalIdFromPath(window.location.pathname);
  return `${getFullUrl('api', {
    envOverride: messagesEnv,
    hubletOverride: messagesHublet
  })}/livechat/v1/message/public/hubspot-app?portalId=${usersPortalId}&mobile=${isAnyMobile()}&embeddedPortalId=${portalId}&traceId=${messagesUtk}`;
}
function buildRequestParams({
  messagesUtk,
  hubspotUtk,
  portalId,
  referrer,
  hstc,
  hssc,
  email,
  identificationToken
}) {
  let requestUrl = `?portalId=${portalId}&${bender.project}=${bender.depVersions[bender.project]}&mobile=${isAnyMobile()}`;
  if (messagesUtk) {
    requestUrl = `${requestUrl}&messagesUtk=${messagesUtk}&traceId=${messagesUtk}`;
  }
  if (hubspotUtk) {
    requestUrl = `${requestUrl}&hubspotUtk=${hubspotUtk}`;
  }
  if (hstc) {
    requestUrl = `${requestUrl}&__hstc=${hstc}`;
  }
  if (hssc) {
    requestUrl = `${requestUrl}&__hssc=${hssc}`;
  }
  if (referrer) {
    requestUrl = `${requestUrl}&referrer=${referrer}`;
  }
  if (identificationToken) {
    requestUrl = `${requestUrl}&identificationToken=${identificationToken}`;
  }
  if (email) {
    requestUrl = `${requestUrl}&email=${email}`;
  }
  return requestUrl;
}
export function getCMSRequestUrl({
  messagesUtk,
  hubspotUtk,
  portalId,
  referrer,
  hstc,
  hssc,
  email,
  identificationToken
}) {
  const requestParams = buildRequestParams({
    messagesUtk,
    hubspotUtk,
    portalId,
    referrer,
    hstc,
    hssc,
    email,
    identificationToken
  });
  return `/_hcms/livechat/widget${requestParams}`;
}
export function getPublicRequestUrl({
  messagesHublet,
  messagesEnv,
  messagesUtk,
  hubspotUtk,
  portalId,
  referrer,
  hstc,
  hssc,
  email,
  identificationToken
}) {
  const domain = getFullUrl('api', {
    envOverride: messagesEnv,
    hubletOverride: messagesHublet
  });
  const requestParams = buildRequestParams({
    messagesUtk,
    hubspotUtk,
    portalId,
    referrer,
    hstc,
    hssc,
    email,
    identificationToken
  });
  return `${domain}/livechat-public/v1/message/public${requestParams}`;
}
export function getPublicRequestUrlForMobileSDK({
  messagesHublet,
  messagesEnv,
  messagesUtk,
  hubspotUtk,
  portalId,
  referrer,
  hstc,
  hssc,
  email,
  identificationToken
}) {
  const domain = getFullUrl('api', {
    envOverride: messagesEnv,
    hubletOverride: messagesHublet
  });
  const requestParams = buildRequestParams({
    messagesUtk,
    hubspotUtk,
    portalId,
    referrer,
    hstc,
    hssc,
    email,
    identificationToken
  });
  const chatflowTag = getChatflowTagFromQueryParams();
  return `${domain}/livechat-public/v1/message/public/mobile${requestParams}&chatflow=${chatflowTag}`;
}