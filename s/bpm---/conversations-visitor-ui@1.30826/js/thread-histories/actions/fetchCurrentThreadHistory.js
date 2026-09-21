'use es6';

import {
    getSelectedThreadId
} from '../../selected-thread/selectors/getSelectedThreadId';
import {
    getSessionId
} from '../../selectors/widgetDataSelectors/getSessionId';
import {
    STUBBED_THREAD_ID
} from '../../threads/constants/stubbedThreadId';
import {
    isStarted
} from '../../constants/asyncStatuses';
import {
    getThreadHistories
} from '../selectors/getThreadHistories';
import {
    fetchThreadHistory
} from './fetchThreadHistory';
export const fetchCurrentThreadHistory = () => (dispatch, getState) => {
    const state = getState();
    const sessionId = getSessionId(state);
    const threadId = getSelectedThreadId(state);
    if (threadId === null || threadId === STUBBED_THREAD_ID) {
        return;
    }
    if (isStarted(getThreadHistories(state).get(threadId))) {
        return;
    }
    dispatch(fetchThreadHistory({
        threadId,
        sessionId
    }));
};