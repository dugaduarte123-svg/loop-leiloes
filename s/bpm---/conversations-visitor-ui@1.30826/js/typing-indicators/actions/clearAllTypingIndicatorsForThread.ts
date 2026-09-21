import get from 'transmute/get';
import { typingStates as typingStatesSelector } from '../selectors/typingStates';
import { clearAllTypingTimeoutsForThread } from './clearAllTypingTimeoutsForThread';
import { clearAllTypingIndicatorStylesForThread } from '../typingIndicatorStyle';
export const clearAllTypingIndicatorsForThread = threadId => (dispatch, getState) => {
  const typingStates = typingStatesSelector(getState());
  const threadTypingStates = get(`${threadId}`, typingStates);
  if (threadTypingStates) {
    threadTypingStates.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
  }
  dispatch(clearAllTypingTimeoutsForThread(threadId));
  dispatch(clearAllTypingIndicatorStylesForThread({
    threadId: `${threadId}`
  }));
};