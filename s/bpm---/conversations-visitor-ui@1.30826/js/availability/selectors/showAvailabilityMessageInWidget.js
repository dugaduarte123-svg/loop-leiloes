'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    hasMessages
} from 'conversations-message-history/thread-history/operators/hasMessages';
import {
    getSelectedThreadId
} from '../../selected-thread/selectors/getSelectedThreadId';
import {
    getIsUnassignedResponderInWidget
} from '../../responders/selectors/getIsUnassignedResponderInWidget';
import {
    historyDataForThread
} from '../../thread-histories/selectors/historyDataForThread';
export const showAvailabilityMessageInWidget = createSelector([getSelectedThreadId, getIsUnassignedResponderInWidget, historyDataForThread], (selectedThreadId, isUnassigned, history) => {
    const isInThreadView = selectedThreadId !== null;
    return isInThreadView && isUnassigned && Boolean(history) && hasMessages(history);
});