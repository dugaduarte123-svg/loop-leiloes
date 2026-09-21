'use es6';

import {
    postExternalApiEvent
} from '../../external-api-events/postExternalApiEvent';
import {
    CONVERSATION_STARTED
} from '../../external-api-events/constants/externalApiEventTypes';
import {
    serializeThreadForExternalEvent
} from '../../external-api-events/util/serializeThreadForExternalEvent';
export const postConversationStartedEvent = ({
    thread
}) => {
    postExternalApiEvent({
        eventType: CONVERSATION_STARTED,
        payload: {
            conversation: serializeThreadForExternalEvent(thread)
        }
    });
};