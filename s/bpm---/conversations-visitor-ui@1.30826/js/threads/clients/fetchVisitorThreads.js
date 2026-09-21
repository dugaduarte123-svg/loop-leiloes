'use es6';

import noAuthHttp from '../../http/noAuthApiClient';
const LIVECHAT_PUBLIC_API_PREFIX = 'livechat-public/v1';
export function fetchVisitorThreads({
    sessionId,
    messagesPageUri
}) {
    return noAuthHttp.get(`${LIVECHAT_PUBLIC_API_PREFIX}/thread/visitor/recent`, {
        query: {
            sessionId
        },
        headers: {
            'X-HubSpot-Messages-Uri': messagesPageUri
        }
    }).then(threads => {
        if (Array.isArray(threads)) {
            return threads.map(thread => {
                if (thread.responder) {
                    thread.assignedAgentId = thread.responder.userId;
                } else {
                    thread.assignedAgentId = null;
                }
                thread.channelDetails = thread.channel;
                delete thread.channel;

                // TODO: remove this once everyone is ungated and we have switched the FE over to use the boolean instead of a number
                thread.unseenCount = thread.hasUnreadMessages ? 1 : 0;
                return thread;
            });
        }
        return [];
    });
}