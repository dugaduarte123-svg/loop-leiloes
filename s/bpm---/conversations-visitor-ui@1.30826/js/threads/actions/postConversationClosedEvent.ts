import { postExternalApiEvent } from '../../external-api-events/postExternalApiEvent';
import { CONVERSATION_CLOSED } from '../../external-api-events/constants/externalApiEventTypes';
import { serializeThreadForExternalEvent } from '../../external-api-events/util/serializeThreadForExternalEvent';
export const postConversationClosedEvent = ({
  thread
}) => {
  postExternalApiEvent({
    eventType: CONVERSATION_CLOSED,
    payload: {
      conversation: serializeThreadForExternalEvent(thread)
    }
  });
};