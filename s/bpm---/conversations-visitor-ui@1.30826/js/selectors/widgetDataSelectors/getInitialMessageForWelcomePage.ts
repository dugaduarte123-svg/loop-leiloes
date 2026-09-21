import { createSelector } from '@reduxjs/toolkit';
import { getInitialMessageText } from './getInitialMessageText';
import { showQuickReplyOutsideChat } from '../../utils/showQuickRepliesOutsideChat';
import { getStagedThreadHistory } from '../../thread-create/selectors/stagedThreadSelectors';
// @ts-ignore not typed
import { threadHistoryToMessageList } from 'conversations-message-history/thread-history/operators/threadHistoryToMessageList';
import { getDynamicWelcomeMessages } from '../../ai/dynamic-welcome-messages/dynamicWelcomeMessagesSelectors';
export const getInitialMessageForWelcomePage = createSelector([getInitialMessageText, showQuickReplyOutsideChat, getStagedThreadHistory, getDynamicWelcomeMessages], (baseInitialMessageText, displayBotQuickRepliesOutsideChat, stagedThreadHistory, dynamicWelcomeMessages) => {
  if (dynamicWelcomeMessages.length > 0) {
    return dynamicWelcomeMessages.map(({
      message
    }) => {
      var _message$richText;
      return (_message$richText = message.richText) !== null && _message$richText !== void 0 ? _message$richText : message.text;
    }).join(' ');
  }
  if (!displayBotQuickRepliesOutsideChat) {
    return baseInitialMessageText;
  }
  const messageRecords = stagedThreadHistory ? threadHistoryToMessageList(stagedThreadHistory) : [];
  return messageRecords.reduce((acc, msg) => acc += ` ${msg.richText || msg.text}`, '');
});