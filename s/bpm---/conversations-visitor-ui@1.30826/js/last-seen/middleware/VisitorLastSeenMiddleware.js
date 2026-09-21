'use es6';

import {
    getChannelName
} from '../../threads/operators/threadGetters';
import {
    STUBBED_THREAD_ID
} from '../../threads/constants/stubbedThreadId';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import {
    markLastMessageReadByVisitor
} from '../actions/markLastMessageReadByVisitor';
import {
    getIsOpen
} from '../../selectors/getIsOpen';
import {
    clearUnseenCountForChannel
} from '../../actions/ConversationsActions/clearUnseenCountForChannel';
import {
    isActiveOnThread
} from '../../selectors/clientSelectors/isActiveOnThread';
import {
    sentByVisitorClient
} from '../../pubnub-message/operators/sentByVisitorClient';
import {
    getTimestamp
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import {
    isConversationalMessage
} from 'conversations-message-history/common-message/operators/isConversationalMessage';
import {
    getSelectedThreadId
} from '../../selected-thread/selectors/getSelectedThreadId';
import {
    getThreadByThreadId
} from '../../threads/selectors/getThreadByThreadId';
import {
    SELECT_THREAD
} from '../../selected-thread/constants/selectedThreadActionTypes';
const markLastMessageRead = ({
    store,
    conversation,
    messageTimestamp
}) => {
    store.dispatch(markLastMessageReadByVisitor({
        conversation,
        messageTimestamp
    }));
};
const VisitorLastSeenMiddleware = store => next => action => {
    const state = store.getState();
    const selectedThreadId = getSelectedThreadId(state);
    const widgetIsOpen = getIsOpen(state);
    if (action.type === SELECT_THREAD) {
        const {
            threadId
        } = action.payload;
        const conversation = getThreadByThreadId(state, {
            threadId
        });
        const channel = getChannelName(conversation);
        if (!!threadId && !!conversation) {
            const prevThreadId = getSelectedThreadId(state);
            if (prevThreadId !== STUBBED_THREAD_ID && threadId !== STUBBED_THREAD_ID && prevThreadId !== threadId && widgetIsOpen) {
                markLastMessageRead({
                    store,
                    conversation
                });
                store.dispatch(clearUnseenCountForChannel({
                    channel,
                    threadId
                }));
            }
        }
    }
    if (action.type === ActionTypes.RECEIVED_INCOMING_MESSAGE) {
        const currentState = store.getState();
        const {
            channel,
            message,
            threadId
        } = action.payload;
        if (channel && isConversationalMessage(message) && !sentByVisitorClient(message) && isActiveOnThread(currentState, threadId)) {
            const conversation = getThreadByThreadId(state, {
                threadId
            });
            const messageTimestamp = getTimestamp(message);
            markLastMessageRead({
                store,
                conversation,
                messageTimestamp
            });
            store.dispatch(clearUnseenCountForChannel({
                threadId
            }));
        }
    }
    const conversation = getThreadByThreadId(state, {
        threadId: selectedThreadId
    });
    if (action.type === ActionTypes.APP_IN_FOREGROUND) {
        if (widgetIsOpen && conversation) {
            markLastMessageRead({
                store,
                conversation
            });
            store.dispatch(clearUnseenCountForChannel({
                threadId: selectedThreadId
            }));
        }
    }
    if (action.type === ActionTypes.TOGGLE_OPEN) {
        const {
            isOpened: widgetWillOpen
        } = action.payload || {};
        if (widgetWillOpen && conversation) {
            markLastMessageRead({
                store,
                conversation
            });
            store.dispatch(clearUnseenCountForChannel({
                threadId: selectedThreadId
            }));
        }
    }
    return next(action);
};
export default VisitorLastSeenMiddleware;