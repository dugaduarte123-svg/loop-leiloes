import { getTypingMessageShouldDisableUserInput } from '../typing-indicators/selectors/getTypingMessageShouldDisableUserInput';
import { getVisitorCanSendMessage } from '../availability/selectors/getVisitorCanSendMessage';
import { getIsBlockedByUnansweredQuickReply } from '../thread-histories/selectors/getIsBlockedByUnansweredQuickReply';
export const getShouldDisableInputForConversation = state => getTypingMessageShouldDisableUserInput(state) || getIsBlockedByUnansweredQuickReply(state) || !getVisitorCanSendMessage(state);