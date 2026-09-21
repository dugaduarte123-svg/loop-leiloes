'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    getFilteredMessages
} from './getFilteredMessages';
import {
    getType
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import {
    EMAIL_CAPTURE_PROMPT
} from 'conversations-message-history/email-capture-prompt/constants/messageTypes';
export const getMostRecentMessageIsEmailPrompt = createSelector([getFilteredMessages], messages => getType(messages.last()) === EMAIL_CAPTURE_PROMPT);