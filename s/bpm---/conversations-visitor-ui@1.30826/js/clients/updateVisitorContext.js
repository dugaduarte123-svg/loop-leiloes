'use es6';

import noAuthHttp from '../http/noAuthApiClient';
export function updateVisitorContext({
    currentUrl,
    sessionId,
    threadId
}) {
    return noAuthHttp.put(`livechat-public/v1/thread/visitor/${threadId}/currentUrl`, {
        query: {
            sessionId,
            threadId
        },
        data: {
            currentUrl
        }
    });
}