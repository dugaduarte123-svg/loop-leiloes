'use es6';

import PortalIdParser from 'PortalIdParser';
import noAuthHttp from '../../http/noAuthApiClient';
const API_ENDPOINT = 'livechat-public/v1/privacy/consentToProcess';
export function sendConsentToProcess({
    sessionId,
    hubspotUtk,
    welcomeMessageId
}) {
    return noAuthHttp.put(API_ENDPOINT, {
        query: {
            sessionId,
            hubspotUtk,
            welcomeMessageId,
            portalId: PortalIdParser.get()
        }
    });
}