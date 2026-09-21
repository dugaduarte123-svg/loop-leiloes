import { getShowInitialMessageBubble } from '../initial-message-bubble/selectors/getShowInitialMessageBubble';
import { getIsBot } from '../quick-reply/operators/getIsBot';
//@ts-ignore untyped file
import { getSelectedThread } from '../selected-thread/selectors/getSelectedThread';
//@ts-ignore untyped file
import { getQuickReplyAllowMultiSelect } from 'conversations-message-history/common-message-format/operators/cmfQuickReplyGetters';
//@ts-ignore untyped file
import { hasUnansweredQuickReplyMessage } from '../selectors/chatSelectors';

// @ts-ignore dependency missing types
import { threadHistoryToMessageList } from 'conversations-message-history/thread-history/operators/threadHistoryToMessageList';
// @ts-ignore dependency missing types
import { getPubSubMessage } from 'conversations-message-history/unpublished-messages/operators/getPubSubMessage';
import { getDisplayBotQuickRepliesOutsideChat } from '../selectors/widgetDataSelectors/getDisplayBotQuickRepliesOutsideChat';
import { hasDynamicWelcomeMessages } from '../ai/dynamic-welcome-messages/dynamicWelcomeMessagesSelectors';
export const showQuickReplyOutsideChat = state => {
  const selectedThread = getSelectedThread(state);
  const messageRecords = threadHistoryToMessageList(state.stagedThread.data);
  const message = getPubSubMessage(messageRecords.last());
  const allowMultiSelect = getQuickReplyAllowMultiSelect(message);
  if (hasDynamicWelcomeMessages(state)) {
    return getShowInitialMessageBubble(state) && hasUnansweredQuickReplyMessage(state, {
      thread: selectedThread,
      searchOnlyForInitialMessage: true
    }) && !allowMultiSelect;
  }
  const displayBotQuickRepliesOutsideChat = getDisplayBotQuickRepliesOutsideChat(state);
  return getShowInitialMessageBubble(state) && getIsBot(state) && hasUnansweredQuickReplyMessage(state, {
    thread: selectedThread,
    searchOnlyForInitialMessage: true
  }) && displayBotQuickRepliesOutsideChat && !allowMultiSelect;
};