import noAuthHttp from '../http/noAuthApiClient';
export function fetchSupplementalInitialMessages({
  botId,
  sessionId,
  hubspotUtk
}) {
  return noAuthHttp.getWithResponse(`livechat-public/v1/bots/public/bot/${botId}/welcomeMessages`, {
    query: {
      sessionId,
      hubspotUtk
    }
  });
}