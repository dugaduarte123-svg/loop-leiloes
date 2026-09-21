import PortalIdParser from 'PortalIdParser';
import noAuthHttp from '../../http/noAuthApiClient';
const LIVECHAT_PUBLIC_API_PREFIX = 'livechat-public/v1';
export function fetchPromptRecommendations(params) {
  return noAuthHttp.get(`${LIVECHAT_PUBLIC_API_PREFIX}/message/public/recommended-questions`, {
    query: {
      portalId: PortalIdParser.get(),
      mobile: params.mobile,
      messagesUtk: params.messagesUtk,
      hubspotUtk: params.hubspotUtk,
      __hstc: params.hstc,
      referrer: params.referrer
    },
    headers: {
      'x-hubspot-messages-uri': params.messagesPageUri
    }
  });
}