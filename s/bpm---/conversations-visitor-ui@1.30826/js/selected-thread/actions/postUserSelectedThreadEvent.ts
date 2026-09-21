import { postExternalApiEvent } from '../../external-api-events/postExternalApiEvent';
import { USER_SELECTED_THREAD } from '../../external-api-events/constants/externalApiEventTypes';
export const postUserSelectedThreadEvent = threadId => {
  postExternalApiEvent({
    eventType: USER_SELECTED_THREAD,
    payload: {
      conversation: {
        conversationId: threadId
      }
    }
  });
};