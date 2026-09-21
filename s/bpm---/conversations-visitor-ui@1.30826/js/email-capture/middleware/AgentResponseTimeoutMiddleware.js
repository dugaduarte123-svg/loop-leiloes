'use es6';

import memoize from 'transmute/memoize';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import {
    isConversationalMessage
} from 'conversations-message-history/common-message/operators/isConversationalMessage';
import {
    isAutomatedChatMessage
} from 'conversations-message-history/common-message/operators/isAutomatedChatMessage';
import {
    isFromAgent
} from 'conversations-message-history/common-message-format/operators/senderTypeComparators';
import {
    getCustomEmailCaptureDelay
} from '../../selectors/widgetDataSelectors/getCustomEmailCaptureDelay';
import {
    shouldCaptureVisitorEmailAddress
} from '../../selectors/widgetDataSelectors/shouldCaptureVisitorEmailAddress';
import {
    widgetIsInAwayMode
} from '../../availability/selectors/widgetIsInAwayMode';
import publishEmailCapturePromptMessage from '../actions/publishEmailCapturePromptMessage';
import {
    getSelectedThread
} from '../../selected-thread/selectors/getSelectedThread';
import {
    CREATE_NEW_THREAD
} from '../../thread-create/constants/actionTypes';
import {
    getThreadId,
    getChannelName
} from '../../threads/operators/threadGetters';
import {
    isClientReady
} from 'conversations-internal-pub-sub/redux/operators/isClientReady';
import {
    getAsyncPubSubClient
} from 'conversations-internal-pub-sub/redux/selectors/pubSubClientGetters';
import {
    getAssignedResponderInWidget
} from '../../responders/selectors/getAssignedResponderInWidget';
import {
    getAgentType
} from 'conversations-internal-schema/responders/operators/getAgentType';
import {
    BOT
} from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
const DEFAULT_AGENT_JOIN_TIMEOUT_IN_MS = 1000;
const AgentResponseTimeoutMiddleware = store => next => {
    const timeouts = {};
    const clearResponseTimeout = threadId => clearTimeout(timeouts[threadId]);
    const setResponseTimeout = memoize((threadId, channel, delay) => {
        timeouts[threadId] = setTimeout(() => {
            store.dispatch(publishEmailCapturePromptMessage({
                channel,
                threadId
            }));
        }, delay);
    });
    return action => {
        switch (action.type) {
            case ActionTypes.THREAD_CREATED_AND_NETWORK_ONLINE:
            case CREATE_NEW_THREAD.SUCCEEDED:
                {
                    const asyncPubSubClient = getAsyncPubSubClient(store.getState());
                    if (!isClientReady(asyncPubSubClient)) {
                        break;
                    }
                    let threadId;
                    let channel;
                    if (action.type === CREATE_NEW_THREAD.SUCCEEDED) {
                        threadId = action.payload.threadId;
                        channel = action.payload.channel;
                    }
                    if (action.type === ActionTypes.THREAD_CREATED_AND_NETWORK_ONLINE) {
                        const thread = getSelectedThread(store.getState());
                        channel = getChannelName(thread);
                        threadId = getThreadId(thread);
                    }
                    const isInAwayMode = widgetIsInAwayMode(store.getState());
                    const responderIsBot = getAgentType(getAssignedResponderInWidget(store.getState())) === BOT;
                    /**
                     * Once the visitor publishes his/her first message,
                     * start a timer for a custom delay, if specified, or a standard delay
                     */
                    if (!responderIsBot && shouldCaptureVisitorEmailAddress(store.getState())) {
                        const customDelay = getCustomEmailCaptureDelay(store.getState());
                        const timeout = isInAwayMode ? DEFAULT_AGENT_JOIN_TIMEOUT_IN_MS : customDelay || DEFAULT_AGENT_JOIN_TIMEOUT_IN_MS;
                        setResponseTimeout(threadId, channel, timeout);
                    }
                    break;
                }
            case ActionTypes.RECEIVED_INCOMING_MESSAGE:
                {
                    const {
                        message,
                        threadId
                    } = action.payload;

                    /**
                     * When a non-automated, conversational message is received from an agent,
                     * cancel the timer
                     */
                    if (isConversationalMessage(message) && !isAutomatedChatMessage(message) && isFromAgent(message)) {
                        clearResponseTimeout(threadId);
                    }
                    break;
                }
            default:
                break;
        }
        return next(action);
    };
};
export default AgentResponseTimeoutMiddleware;