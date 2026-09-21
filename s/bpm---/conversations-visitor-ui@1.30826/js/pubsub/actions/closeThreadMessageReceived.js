'use es6';

import {
    getThreadId
} from '../../threads/operators/threadGetters';
import {
    postConversationClosedEvent
} from '../../threads/actions/postConversationClosedEvent';
import {
    defaultMessageReceived
} from '../../actions/defaultMessageReceived';
export const closeThreadMessageReceived = ({
    message,
    channel,
    thread
}) => dispatch => {
    const threadId = getThreadId(thread);
    postConversationClosedEvent({
        thread
    });
    dispatch(defaultMessageReceived(message, channel, threadId));
};