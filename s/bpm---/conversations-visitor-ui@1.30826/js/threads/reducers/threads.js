'use es6';

import {
    Map as ImmutableMap
} from 'immutable';
import {
    handleActions,
    combineActions
} from 'flux-actions';
import set from 'transmute/set';
import get from 'transmute/get';
import merge from 'transmute/merge';
import update from 'transmute/update';
import Raven from 'raven-js';
import {
    isConversationalMessage
} from 'conversations-message-history/common-message/operators/isConversationalMessage';
import {
    isEmailCaptureResponseMessage
} from 'conversations-message-history/email-capture-response/operators/isEmailCaptureResponseMessage';
import {
    isCloseThreadMessage
} from 'conversations-message-history/thread-status-update/operators/isCloseThreadMessage';
import {
    isOpenThreadMessage
} from 'conversations-message-history/thread-status-update/operators/isOpenThreadMessage';
import {
    isAssignmentUpdateMessage
} from 'conversations-message-history/assignment-update-message/operators/isAssignmentUpdateMessage';
import {
    getThreadId
} from '../operators/threadGetters';
import {
    setStatus
} from '../operators/setStatus';
import ChatFilterOptions from 'conversations-internal-schema/constants/ChatFilterOptions';
import {
    setLatestReadTimestamp
} from '../operators/setLatestReadTimestamp';
import {
    setLatestMessage
} from '../operators/setLatestMessage';
import {
    setAssignedAgentFromAssignmentMessage
} from '../operators/setAssignedAgentFromAssignmentMessage';
import {
    setCurrentUrl
} from '../operators/setCurrentUrl';
import {
    setHasChannelSwitchedToEmail
} from '../operators/setHasChannelSwitchedToEmail';
import {
    getData,
    uninitialized,
    started,
    succeeded,
    failed
} from '../../constants/asyncStatuses';
import {
    PUBLISH_MESSAGE
} from '../../pubsub/constants/asyncActionTypes';
import {
    SET_THREADS_SUCCESS,
    UPDATE_THREAD_CURRENT_URL
} from '../constants/actionTypes';
import {
    CREATE_NEW_THREAD
} from '../../thread-create/constants/actionTypes';
import {
    ADD_CONVERSATION,
    RECEIVED_INCOMING_MESSAGE,
    LAST_SEEN_SUCCESS,
    INCREMENT_UNSEEN_COUNT,
    CLEAR_UNSEEN_COUNT_FOR_CHANNEL,
    GET_VISITOR_THREADS_STARTED,
    GET_VISITOR_THREADS_SUCCESS,
    GET_VISITOR_THREADS_FAILURE
} from '../../constants/VisitorActionTypes';
import {
    CHANNEL_CHANGE_RECEIVED,
    GENERIC_CHANNEL_CHANGE_RECEIVED
} from '../../pubsub/constants/pubsubActionTypes';
import {
    getNewChannelName
} from 'conversations-internal-pub-sub/channel-change/operators/channelChangeGetters';
import {
    CHANNEL_DETAILS
} from '../constants/KeyPaths';
import {
    setChannelName
} from '../../channel-details/operators/channelDetailsSetters';
const initialState = uninitialized(ImmutableMap());
export function updateLatestMessageAndThreadPreview(message) {
    return thread => {
        thread = setLatestMessage(message, thread);
        return thread;
    };
}
const threadsReducer = handleActions({
    [combineActions(ADD_CONVERSATION, CREATE_NEW_THREAD.SUCCEEDED)]: (state, action) => {
        const {
            conversation
        } = action.payload;
        const threadId = getThreadId(conversation);
        return Object.assign({}, state, {
            data: set(threadId, conversation, getData(state))
        });
    },
    [SET_THREADS_SUCCESS]: state => succeeded(getData(state)),
    [LAST_SEEN_SUCCESS](state, action) {
        const {
            threadId,
            latestMessageTimestamp
        } = action.payload;
        const existingThread = get(threadId, getData(state));
        if (!existingThread || !latestMessageTimestamp) {
            return state;
        }
        return Object.assign({}, state, {
            data: update(threadId, setLatestReadTimestamp(latestMessageTimestamp), getData(state))
        });
    },
    [PUBLISH_MESSAGE.SUCCEEDED](state, action) {
        const {
            threadId,
            publishedMessage
        } = action.payload;
        const updateFunc = isConversationalMessage(publishedMessage) && !isEmailCaptureResponseMessage(publishedMessage) ? updateLatestMessageAndThreadPreview : () => thread => thread;
        return Object.assign({}, state, {
            data: update(threadId, updateFunc(publishedMessage), getData(state))
        });
    },
    [RECEIVED_INCOMING_MESSAGE](state, action) {
        const {
            threadId,
            message
        } = action.payload;
        const updateFunc = isConversationalMessage(message) && !isEmailCaptureResponseMessage(message) ? updateLatestMessageAndThreadPreview : () => thread => thread;
        const newData = update(threadId, updateFunc(message), getData(state));
        if (isAssignmentUpdateMessage(message)) {
            return Object.assign({}, state, {
                data: update(threadId, setAssignedAgentFromAssignmentMessage(message), newData)
            });
        } else if (isCloseThreadMessage(message)) {
            return Object.assign({}, state, {
                data: update(threadId, setStatus(ChatFilterOptions.ENDED), newData)
            });
        } else if (isOpenThreadMessage(message)) {
            return Object.assign({}, state, {
                data: update(threadId, setStatus(ChatFilterOptions.STARTED), newData)
            });
        }
        return Object.assign({}, state, {
            data: newData
        });
    },
    [INCREMENT_UNSEEN_COUNT](state, action) {
        const {
            threadId
        } = action.payload;
        return Object.assign({}, state, {
            data: update(threadId, update('unseenCount', unseenCount => unseenCount + 1), getData(state))
        });
    },
    [CLEAR_UNSEEN_COUNT_FOR_CHANNEL](state, action) {
        const {
            threadId
        } = action.payload;
        return Object.assign({}, state, {
            data: update(threadId, set('unseenCount', 0), getData(state))
        });
    },
    [GET_VISITOR_THREADS_STARTED]: state => started(getData(state)),
    [GET_VISITOR_THREADS_SUCCESS]: (state, action) => {
        const {
            threads
        } = action.payload;
        const newThreads = !threads || !threads.length ? ImmutableMap() : threads.reduce((threadsMap, newThread) => {
            const threadId = getThreadId(newThread);
            return threadsMap.set(threadId, newThread);
        }, ImmutableMap());
        return succeeded(merge(newThreads, getData(state)));
    },
    [GET_VISITOR_THREADS_FAILURE]: state => failed(getData(state)),
    [UPDATE_THREAD_CURRENT_URL](state, action) {
        const {
            threadId,
            currentUrl
        } = action.payload;
        return Object.assign({}, state, {
            data: getData(state).update(threadId, setCurrentUrl(currentUrl))
        });
    },
    [GENERIC_CHANNEL_CHANGE_RECEIVED]: (state, action) => {
        const {
            threadId
        } = action.payload;
        return Object.assign({}, state, {
            data: getData(state).update(threadId, setHasChannelSwitchedToEmail(true))
        });
    },
    [CHANNEL_CHANGE_RECEIVED]: (state, action) => {
        const {
            threadId,
            channelChange
        } = action.payload;
        const newChannelName = getNewChannelName(channelChange);
        return Object.assign({}, state, {
            data: getData(state).updateIn([threadId, ...CHANNEL_DETAILS], setChannelName(newChannelName))
        });
    }
}, initialState);
const safeReducer = reducer => (state, action) => {
    try {
        return reducer(state, action);
    } catch (e) {
        var _getData, _getData$toJS;
        Raven.captureException(e, {
            extra: {
                state: {
                    data: (_getData = getData(state)) === null || _getData === void 0 || (_getData$toJS = _getData.toJS) === null || _getData$toJS === void 0 ? void 0 : _getData$toJS.call(_getData),
                    status: state.status
                },
                action
            }
        });
        return state;
    }
};
export default safeReducer(threadsReducer);