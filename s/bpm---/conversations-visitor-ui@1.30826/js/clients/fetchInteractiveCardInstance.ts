import noAuthHttp from '../http/noAuthApiClient';
export function fetchInteractiveCardInstance({
  cardInstanceId,
  sessionId
}) {
  return noAuthHttp.get(`livechat-public/v1/interactive-cards/public/${cardInstanceId}`, {
    query: {
      sessionId
    }
  });
}