'use es6';

import noAuthHttp from '../http/noAuthApiClient';
export function sendVisitorEmailAddress({
    threadId,
    email,
    sessionId,
    hubspotUtk
}) {
    return noAuthHttp.post(`livechat-public/v1/visitor/public`, {
        query: {
            threadId,
            email,
            sessionId,
            hubspotUtk
        }
    });
}