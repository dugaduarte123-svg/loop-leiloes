'use es6';

import {
    createAction
} from '@reduxjs/toolkit';
import {
    REFRESH_WIDGET_DATA
} from '../constants/actionTypes';
import {
    resetStubbedThread
} from '../../stubbed-thread-history/actions/resetStubbedThread';
import {
    stageInitialMessage
} from '../../actions/PublishActions/stageInitialMessage';
import {
    isCreatingThread,
    didFailToCreateThread,
    getStagedThreadHistory
} from '../../thread-create/selectors/stagedThreadSelectors';
import {
    getSelectedThreadId
} from '../../selected-thread/selectors/getSelectedThreadId';
import {
    STUBBED_THREAD_ID
} from '../../threads/constants/stubbedThreadId';
import {
    removeAllClientTriggers
} from '../../client-triggers/actions/removeAllClientTriggers';
import {
    bootstrapInitialWidgetUi
} from '../../initial-message-bubble/actions/bootstrapInitialWidgetUi';
import {
    setMessageEditorStagingText
} from '../../actions/messageEditorActions';
export const refreshWidgetDataAction = createAction(REFRESH_WIDGET_DATA, widgetData => ({
    payload: widgetData
}));
export function refreshWidgetData(widgetData) {
    return (dispatch, getState) => {
        dispatch(refreshWidgetDataAction(widgetData));
        const isStubbedThread = getSelectedThreadId(getState()) === STUBBED_THREAD_ID;
        const isViewingStubbedThread = isStubbedThread && !isCreatingThread(getState());
        const hasStubbedThreadCreationFailed = didFailToCreateThread(getState());

        // If these two conditions are met, it means the initial message failed to send
        // due to the initial messages changing. This resets the thread and stages the initial message again
        // without removing the failure message ot updating the UI.
        if (isViewingStubbedThread && hasStubbedThreadCreationFailed) {
            const visitorMessage = getStagedThreadHistory(getState()).getIn(['messages', 'results']).find(message => message.get('direction') === 'INCOMING');
            dispatch(resetStubbedThread(true));
            dispatch(stageInitialMessage(true));
            dispatch(setMessageEditorStagingText(visitorMessage.get('text')));
            return;
        } else if (isViewingStubbedThread) {
            dispatch(resetStubbedThread());
            dispatch(stageInitialMessage());
        }
        dispatch(removeAllClientTriggers());
        dispatch(bootstrapInitialWidgetUi(widgetData));
    };
}