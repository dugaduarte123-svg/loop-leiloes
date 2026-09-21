'use es6';

import {
    hasChatMessageFromAgent
} from 'conversations-message-history/thread-history/operators/hasChatMessageFromAgent';
import {
    getTypicalResponseTime
} from 'conversations-internal-schema/availability/operators/config/availabilityConfigGetters';
import {
    publishTypicalResponseTimeMessage
} from '../../typical-response-time/actions/publishTypicalResponseTimeMessage';
import {
    getWidgetAvailabilityOptions
} from '../selectors/getWidgetAvailabilityOptions';
import {
    getThreadByThreadId
} from '../../threads/selectors/getThreadByThreadId';
import {
    historyDataForThread
} from '../../thread-histories/selectors/historyDataForThread';
import {
    canSendNewTypicalResponseTimeMessage
} from '../../thread-histories/operators/canSendNewTypicalResponseTimeMessage';
import {
    getThreadId
} from '../../threads/operators/threadGetters';

function publish({
    channel,
    thread,
    state,
    dispatch
}) {
    const availabilityOptions = getWidgetAvailabilityOptions(state);
    const typicalResponseTime = getTypicalResponseTime(availabilityOptions);
    const shouldPublishTypicalResponseTimeMessage = !!typicalResponseTime;
    const threadId = getThreadId(thread);
    const threadHistory = historyDataForThread(state, {
        thread
    });
    if (shouldPublishTypicalResponseTimeMessage) {
        if (canSendNewTypicalResponseTimeMessage(threadHistory)) {
            dispatch(publishTypicalResponseTimeMessage({
                channel,
                threadId
            }));
        }
    }
}
export const publishAvailabilityMessage = ({
    channel,
    threadId
}) => {
    return (dispatch, getState) => {
        const thread = getThreadByThreadId(getState(), {
            threadId
        });
        const threadHistory = historyDataForThread(getState(), {
            thread
        });
        if (threadHistory && hasChatMessageFromAgent(threadHistory)) {
            return;
        }
        publish({
            channel,
            thread,
            state: getState(),
            dispatch
        });
    };
};