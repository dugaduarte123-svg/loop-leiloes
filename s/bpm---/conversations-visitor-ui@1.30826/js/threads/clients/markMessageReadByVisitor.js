'use es6';

import PortalIdParser from 'PortalIdParser';
import noAuthHttp from '../../http/noAuthApiClient';
const LIVECHAT_PUBLIC_API_PREFIX = 'livechat-public/v1';
export function markMessageReadByVisitor({
    threadId,
    sessionId,
    messageId
}) {
    return noAuthHttp.post(`${LIVECHAT_PUBLIC_API_PREFIX}/visitorReadThread/thread/${threadId}/message/${messageId}`, {
        query: {
            portalId: PortalIdParser.get(),
            sessionId
        }
    });
}