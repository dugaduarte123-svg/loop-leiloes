// @ts-ignore untyped module
import { getSelectedThread } from '../../selected-thread/selectors/getSelectedThread';
// @ts-ignore untyped module
import { getAllowUserInput } from './getAllowUserInput';
// @ts-ignore untyped module
import { hasUnansweredQuickReplyMessage } from '../../selectors/chatSelectors';
export const getIsBlockedByUnansweredQuickReply = state => {
  const thread = getSelectedThread(state);
  return Boolean(!getAllowUserInput(state, {
    thread
  }) && hasUnansweredQuickReplyMessage(state, {
    thread
  }));
};