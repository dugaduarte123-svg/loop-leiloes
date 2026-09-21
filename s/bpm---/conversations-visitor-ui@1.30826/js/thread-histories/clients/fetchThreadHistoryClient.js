'use es6';

import PortalIdParser from 'PortalIdParser';
import noAuthHttp from '../../http/noAuthApiClient';
export const fetchThreadHistoryClient = ({
    sessionId,
    threadId,
    offsetTimestamp,
    offsetOrdinal
}) => noAuthHttp.get(`livechat-public/v1/conversationhistory/visitor/${threadId}`, {
    query: {
        sessionId,
        offsetTimestamp,
        offsetOrdinal,
        portalId: PortalIdParser.get(),
        sortDirection: 'DESCENDING',
        expectedResponseType: 'WRAPPER_V2'
    }
});