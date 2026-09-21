import noAuthHttp from '../../http/noAuthApiClient';
const RESOLVE_ATTACHMENT_PATH = 'livechat-public/v1/attachment/resolve/thread';
export function resolveThreadAttachmentsClient({
  fileIds,
  sessionId,
  threadId
}) {
  return noAuthHttp.get(`${RESOLVE_ATTACHMENT_PATH}/${threadId}`, {
    query: {
      fileId: fileIds,
      sessionId
    }
  });
}