import { getThreadId } from '../../threads/operators/threadGetters';
export const serializeThreadForExternalEvent = thread => {
  return {
    conversationId: getThreadId(thread)
  };
};