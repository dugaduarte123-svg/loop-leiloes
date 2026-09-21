'use es6';

import {
    Map as ImmutableMap
} from 'immutable';
import {
    getId
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import {
    addPageOfMessagesToThreadHistory
} from 'conversations-message-history/thread-history/operators/addPageOfMessagesToThreadHistory';
import {
    removeMessageFromThreadHistory
} from 'conversations-message-history/thread-history/operators/removeMessageFromThreadHistory';
import {
    updateMessageInThreadHistory
} from 'conversations-message-history/thread-history/operators/updateMessageInThreadHistory';
import ThreadHistory from 'conversations-message-history/thread-history/records/ThreadHistory';
import {
    handleActions
} from 'flux-actions';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import {
    PUBLISH_MESSAGE
} from '../../pubsub/constants/asyncActionTypes';
import {
    CREATE_NEW_THREAD
} from '../../thread-create/constants/actionTypes';
import {
    THREAD_HISTORY_FETCH_STARTED,
    THREAD_HISTORY_FETCHED,
    THREAD_HISTORY_FETCH_FAILED,
    REMOVE_MESSAGE_IN_CONVERSATION
} from '../constants/ActionTypes';
import {
    addMessageToThreadHistory
} from '../operators/addMessageToThreadHistory';
import {
    getData,
    uninitialized,
    started,
    succeeded,
    failed
} from '../../constants/asyncStatuses';
const initialState = ImmutableMap();
const DEFAULT_ENTRY = uninitialized(new ThreadHistory());
const getEntryOrDefault = (state, threadId) => state.get(threadId) || DEFAULT_ENTRY;
export default handleActions({
    [CREATE_NEW_THREAD.SUCCEEDED](state, action) {
        const {
            threadId,
            threadHistory
        } = action.payload;
        return state.set(threadId, succeeded(threadHistory));
    },
    [THREAD_HISTORY_FETCH_STARTED](state, action) {
        const {
            threadId
        } = action.payload;
        const entry = getEntryOrDefault(state, threadId);
        return state.set(threadId, started(getData(entry)));
    },
    [THREAD_HISTORY_FETCHED](state, action) {
        const {
            threadId,
            threadHistory: newHistoryPage
        } = action.payload;
        const entry = getEntryOrDefault(state, threadId);
        return state.set(threadId, succeeded(addPageOfMessagesToThreadHistory(newHistoryPage)(getData(entry))));
    },
    [THREAD_HISTORY_FETCH_FAILED](state, action) {
        const {
            threadId
        } = action.payload;
        const entry = getEntryOrDefault(state, threadId);
        return state.set(threadId, failed(getData(entry)));
    },
    [ActionTypes.RECEIVED_INCOMING_MESSAGE](state, action) {
        const {
            message,
            threadId
        } = action.payload;
        const messageKey = getId(message);
        const entry = state.get(threadId);
        if (!entry) return state;
        return state.set(threadId, Object.assign({}, entry, {
            data: addMessageToThreadHistory(messageKey, message)(getData(entry))
        }));
    },
    [PUBLISH_MESSAGE.SUCCEEDED](state, action) {
        const {
            publishedMessage,
            threadId
        } = action.payload;
        const messageKey = getId(publishedMessage);
        const entry = state.get(threadId);
        if (!entry) return state;
        return state.set(threadId, Object.assign({}, entry, {
            data: addMessageToThreadHistory(messageKey, publishedMessage)(getData(entry))
        }));
    },
    [REMOVE_MESSAGE_IN_CONVERSATION](state, action) {
        const {
            message,
            threadId
        } = action.payload;
        const messageKey = getId(message);
        const entry = state.get(threadId);
        if (!entry) return state;
        return state.set(threadId, Object.assign({}, entry, {
            data: removeMessageFromThreadHistory(messageKey, message)(getData(entry))
        }));
    },
    [ActionTypes.UPDATE_MESSAGE_IN_CONVERSATION](state, action) {
        const {
            message,
            threadId,
            updated
        } = action.payload;
        const messageKey = getId(message);
        const entry = state.get(threadId);
        if (!entry) return state;
        return state.set(threadId, Object.assign({}, entry, {
            data: updateMessageInThreadHistory(messageKey, updated)(getData(entry))
        }));
    }
}, initialState);