/* hs-eslint ignored failing-rules */

'use es6';

import {
    STUBBED_THREAD_ID
} from '../../threads/constants/stubbedThreadId';
import {
    stageMessageOnStubbedThread
} from '../../stubbed-thread-history/actions/stageMessageOnStubbedThread';
import {
    addAvailabilityMessage
} from '../../availability/actions/addAvailabilityMessage';
import {
    publishMessage
} from '../../pubsub/actions/publishMessage';
export function publishMessageToConversation({
    channel,
    message,
    threadId
}) {
    return dispatch => {
        if (threadId === STUBBED_THREAD_ID) {
            dispatch(stageMessageOnStubbedThread(message));
        } else {
            dispatch(publishMessage({
                channel,
                message,
                threadId
            })).then(() => dispatch(addAvailabilityMessage({
                channel,
                threadId
            }))).catch(err => {
                setTimeout(() => {
                    throw err;
                });
            });
        }
    };
}