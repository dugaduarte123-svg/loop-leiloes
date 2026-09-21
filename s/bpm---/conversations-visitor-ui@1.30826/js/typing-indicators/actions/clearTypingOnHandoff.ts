// @ts-ignore not typed
import { getAssignedAgentId } from 'conversations-message-history/assignment-update-message/operators/assignmentGetters';
import get from 'transmute/get';
import { typingStates as getTypingStates } from '../selectors/typingStates';
import { clearAllTypingIndicatorsForThread } from './clearAllTypingIndicatorsForThread';
export const clearTypingOnHandoff = (message, threadId) => (dispatch, getState) => {
  const newAssignedAgentId = getAssignedAgentId(message);
  const threadTypingStates = get(`${threadId}`, getTypingStates(getState()));
  const isSameAgentReassignment = newAssignedAgentId && (threadTypingStates === null || threadTypingStates === void 0 ? void 0 : threadTypingStates.has(`${newAssignedAgentId}`));
  if (!isSameAgentReassignment && threadTypingStates) {
    dispatch(clearAllTypingIndicatorsForThread(threadId));
  }
};