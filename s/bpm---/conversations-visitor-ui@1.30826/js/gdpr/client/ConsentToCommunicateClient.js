'use es6';

import PortalIdParser from 'PortalIdParser';
import noAuthHttp from '../../http/noAuthApiClient';
const API_ENDPOINT = 'livechat-public/v1/privacy/consentToCommunicate';
export function sendConsentToCommunicate({
    sessionId,
    hubspotUtk,
    threadId
}) {
    return noAuthHttp.put(API_ENDPOINT, {
        query: {
            sessionId,
            hubspotUtk,
            threadId,
            portalId: PortalIdParser.get()
        }
    });
}