'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    getCurrentUrlByThreadId
} from '../../threads/selectors/getCurrentUrlByThreadId';
import {
    getMessagesPageUri
} from '../../selectors/widgetDataSelectors/getMessagesPageUri';

/**
 *
 * @param {object} state
 * @param {object} props
 * @param {string} props.threadId
 * @return {boolean}
 */
export const shouldRecordUrlContextUpdate = createSelector([getCurrentUrlByThreadId, getMessagesPageUri], (currentUrl, messagesPageUri) => {
    return currentUrl !== messagesPageUri;
});