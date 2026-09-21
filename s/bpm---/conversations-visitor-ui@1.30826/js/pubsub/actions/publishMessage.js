/* hs-eslint ignored failing-rules */

'use es6';

import {
    getPubSubClient
} from 'conversations-internal-pub-sub/redux/selectors/pubSubClientGetters';
import {
    getId
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import {
    deserialize,
    serialize
} from 'conversations-message-history/common-message/serializers/messageSerializer';
import {
    isFromVisitor
} from 'conversations-message-history/common-message-format/operators/senderTypeComparators';
import {
    isClosed
} from '../../threads/operators/isClosed';
import {
    createAction
} from '@reduxjs/toolkit';
import Raven from 'raven-js';
import {
    updateMessageInConversation
} from '../../actions/ConversationsActions/updateMessageInConversation';
import {
    PUBLISH_MESSAGE
} from '../../pubsub/constants/asyncActionTypes';
import {
    getThreadByThreadId
} from '../../threads/selectors/getThreadByThreadId';
import {
    getCurrentThreadHistoryFetchStatus
} from '../../thread-history/selectors/getCurrentThreadHistoryFetchStatus';
import {
    ASYNC_STATUS
} from '../../constants/asyncStatuses';
import {
    CUSTOMER_AGENT_FEEDBACK_MESSAGE
} from 'conversations-message-history/customer-agent-feedback-message/constants/messageTypes';
export const publishMessageStarted = createAction(PUBLISH_MESSAGE.STARTED, ({
    channel,
    message,
    messageKey,
    threadId
}) => ({
    payload: {
        channel,
        message,
        messageKey,
        threadId
    }
}));
export const publishMessageSucceeded = createAction(PUBLISH_MESSAGE.SUCCEEDED, ({
    channel,
    messageKey,
    publishedMessage,
    threadId
}) => ({
    payload: {
        channel,
        messageKey,
        publishedMessage,
        threadId
    }
}));
export const publishMessageFailed = createAction(PUBLISH_MESSAGE.FAILED, ({
    channel,
    messageKey,
    message,
    threadId,
    error
}) => ({
    payload: {
        channel,
        messageKey,
        message,
        threadId,
        error
    }
}));
let lastPublishedMessageId;
export const publishMessage = ({
    channel,
    message,
    threadId
}) => (dispatch, getState) => {
    const thread = getThreadByThreadId(getState(), {
        threadId
    });
    if (message.id === lastPublishedMessageId) {
        Raven.captureMessage('publishMessage attempted duplicate message', {
            level: 'warning',
            extra: {
                messageId: message.id
            }
        });
        // prevent the message from being sent multiple times in edge cases
        return Promise.resolve();
    } else {
        lastPublishedMessageId = message.id;
    }
    if (getCurrentThreadHistoryFetchStatus(getState()) === ASYNC_STATUS.STARTED && isFromVisitor(message) // Prevent system messages from being blocked while waiting for thread history on slow networks
    ) {
        dispatch(publishMessageFailed({
            channel,
            messageKey: getId(message),
            message,
            threadId,
            error: 'message sent while threads fetching'
        }));
        return Promise.resolve();
    }
    if (isClosed(thread)) {
        return Promise.resolve();
    }
    dispatch(publishMessageStarted({
        channel,
        message,
        messageKey: getId(message),
        threadId
    }));
    const client = getPubSubClient(getState());
    const publishData = {
        message: serialize(message),
        channel
    };
    const promise = client.publish(publishData).then(({
        data: json
    }) => {
        const publishedMessage = deserialize({
            json
        });
        dispatch(publishMessageSucceeded({
            channel,
            messageKey: getId(message),
            publishedMessage,
            threadId
        }));

        // Skip updating messages that are hidden from visitors or are CustomerAgentFeedbackMessage
        const messageType = publishedMessage.get ? publishedMessage.get('@type') : publishedMessage['@type'];
        const hiddenBy = publishedMessage.get ? publishedMessage.get('hiddenBy') : publishedMessage.hiddenBy;
        if (messageType !== CUSTOMER_AGENT_FEEDBACK_MESSAGE && hiddenBy !== 'VISITOR') {
            dispatch(updateMessageInConversation({
                updated: publishedMessage,
                channel,
                message,
                threadId
            }));
        }
    }).catch(error => {
        dispatch(publishMessageFailed({
            channel,
            messageKey: getId(message),
            message,
            threadId,
            error
        }));
    });
    promise.catch(err => {
        setTimeout(() => {
            throw err;
        });
    });
    return promise;
};