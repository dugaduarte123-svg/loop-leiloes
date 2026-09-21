'use es6';

import {
    publishMessage
} from '../../pubsub/actions/publishMessage';
import {
    getUnpublishedMessage
} from '../../pubsub/operators/getUnpublishedMessage';
import {
    getSelectedThreadId
} from '../../selected-thread/selectors/getSelectedThreadId';
import {
    removeMessageInConversation
} from '../../thread-histories/actions/removeMessageInConversation';
import {
    getThreadByThreadId
} from '../../threads/selectors/getThreadByThreadId';
import {
    trackInteraction
} from '../../usage-tracking/actions/trackInteraction';
import {
    EVENT_NAMES
} from '../../usage-tracking/constants/eventNames';
import {
    getChannelName
} from '../../threads/operators/threadGetters';
export function republishMessage(message) {
    return (dispatch, getState) => {
        const threadId = getSelectedThreadId(getState());
        const thread = getThreadByThreadId(getState(), {
            threadId
        });
        const channel = getChannelName(thread);
        const unpublishedMessage = getUnpublishedMessage(message);
        dispatch(removeMessageInConversation({
            message: unpublishedMessage,
            threadId
        }));
        dispatch(publishMessage({
            channel,
            message: unpublishedMessage,
            threadId
        }));
        dispatch(trackInteraction(EVENT_NAMES.REPUBLISH_MESSAGE));
    };
}