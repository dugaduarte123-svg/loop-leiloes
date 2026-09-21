export const THREAD_HISTORY_FETCH_STARTED = 'THREAD_HISTORY_FETCH_STARTED';
export const THREAD_HISTORY_FETCHED = 'THREAD_HISTORY_FETCHED';
export const THREAD_HISTORY_FETCH_FAILED = 'THREAD_HISTORY_FETCH_FAILED';
export const threadHistoryFetchStarted = ({
  threadId
}) => ({
  type: THREAD_HISTORY_FETCH_STARTED,
  payload: {
    threadId
  }
});
export const threadHistoryFetched = ({
  threadId,
  threadHistory,
  hasVisitorEmail
}) => ({
  type: THREAD_HISTORY_FETCHED,
  payload: {
    threadId,
    threadHistory,
    hasVisitorEmail
  }
});
export const threadHistoryFetchFailed = ({
  threadId
}) => ({
  type: THREAD_HISTORY_FETCH_FAILED,
  payload: {
    threadId
  }
});
export const REMOVE_MESSAGE_IN_CONVERSATION = 'REMOVE_MESSAGE_IN_CONVERSATION';