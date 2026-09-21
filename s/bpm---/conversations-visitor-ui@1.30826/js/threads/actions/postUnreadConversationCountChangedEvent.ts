import { postExternalApiEvent } from '../../external-api-events/postExternalApiEvent';
import { UNREAD_CONVERSATION_COUNT_CHANGED } from '../../external-api-events/constants/externalApiEventTypes';
export const postUnreadConversationCountChangedEvent = ({
  unreadCount
}) => {
  postExternalApiEvent({
    eventType: UNREAD_CONVERSATION_COUNT_CHANGED,
    payload: {
      unreadCount
    }
  });
};