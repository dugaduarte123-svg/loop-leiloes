// @ts-ignore untyped file
import { getCurrentThreadId } from '../../thread-history/selectors/getCurrentThreadId';
export const getTypingMessageShouldDisableUserInput = state => {
  const threadId = getCurrentThreadId(state);
  const typingMessageForThread = state.typingIndicatorStyle[threadId];
  if (!typingMessageForThread) {
    return false;
  }
  return !!Object.values(typingMessageForThread).find(typingMessage => typingMessage.shouldDisableUserInput);
};