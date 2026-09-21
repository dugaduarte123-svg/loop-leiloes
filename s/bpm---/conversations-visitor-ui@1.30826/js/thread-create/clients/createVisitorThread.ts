import PortalIdParser from 'PortalIdParser';
import noAuthHttp from '../../http/noAuthApiClient';
import { getSpamProtectionResponse } from '../../utils/getSpamProtectionResponse';
import { isInPreview as getIsInPreview } from '../../utils/isInPreview';
import chirpClient from '../../utils/chirpClient';
import { createVisitorThreadForPreviewRpc } from '../../../__generated__/chirp/com/hubspot/conversations/livechat/rpc/VisitorThreadPreviewRpc';
export async function createVisitorThread({
  sessionId,
  messageId,
  hubspotUtk,
  messagesPageUri,
  visitorThreadInitialHistory,
  zoneId,
  entryUrlMetadata,
  widgetData
}) {
  const isInPreview = getIsInPreview();
  const visitorMessage = visitorThreadInitialHistory[visitorThreadInitialHistory.length - 1];
  const expectedInitialHistory = visitorThreadInitialHistory.slice(0, -1).map(message => message.richText || message.text);
  if (isInPreview) {
    return chirpClient.call(createVisitorThreadForPreviewRpc, {
      request: {
        sessionId,
        welcomeMessageId: messageId,
        hubspotUtk,
        url: messagesPageUri,
        zoneId,
        publicVisitorThreadCreationRequest: {
          visitorMessage,
          expectedInitialHistory,
          entryUrlMetadata
        }
      }
    });
  }
  const spamProtectionResponse = await getSpamProtectionResponse(widgetData);
  return noAuthHttp.post(`livechat-public/v1/thread/visitor/create`, {
    query: {
      sessionId,
      welcomeMessageId: messageId,
      hubspotUtk,
      portalId: PortalIdParser.get(),
      expectedResponseType: 'WRAPPER_V2',
      zoneId
    },
    data: {
      visitorMessage,
      expectedInitialHistory,
      entryUrlMetadata,
      spamProtectionResponse
    },
    headers: {
      'X-HubSpot-Messages-Uri': messagesPageUri
    }
  });
}