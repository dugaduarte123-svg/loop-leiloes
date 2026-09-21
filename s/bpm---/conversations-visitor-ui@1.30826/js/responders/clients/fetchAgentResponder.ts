import PortalIdParser from 'PortalIdParser';
import noAuthHttp from '../../http/noAuthApiClient';
export async function fetchAgentResponder({
  senderId,
  agentType,
  sessionId,
  threadId
}) {
  const portalId = PortalIdParser.get();
  const responders = await noAuthHttp.get(`livechat-public/v1/responder/batch`, {
    query: {
      agentType,
      portalId,
      sessionId,
      threadId,
      agentId: senderId
    }
  });
  return Array.isArray(responders) ? responders[0] : null;
}