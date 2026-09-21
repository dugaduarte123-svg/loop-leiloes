import ThreadHistory from 'conversations-message-history/thread-history/records/ThreadHistory';
export const buildThreadHistoryFromResponse = threadHistory => {
  return new ThreadHistory(threadHistory);
};