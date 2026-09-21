import noAuthHttp from '../../http/noAuthApiClient';
const LIVECHAT_PUBLIC_API_PREFIX = 'livechat-public/v1/thread/visitor';
export function endVisitorThread({
  threadId,
  sessionId
}) {
  return noAuthHttp.put(`${LIVECHAT_PUBLIC_API_PREFIX}/${threadId}/close`, {
    query: {
      sessionId
    }
  });
}