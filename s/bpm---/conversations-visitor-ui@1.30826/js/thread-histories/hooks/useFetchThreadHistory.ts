import { registerQuery, useQuery } from 'data-fetching-client';
//@ts-ignore untyped-file
import { fetchThreadHistoryClient } from '../clients/fetchThreadHistoryClient';
export const FETCH_THREAD_HISTORY_FIELD_NAME = 'fetchThreadHistory';
export const FETCH_THREAD_HISTORY_QUERY = registerQuery({
  fieldName: FETCH_THREAD_HISTORY_FIELD_NAME,
  args: ['sessionId', 'threadId', 'offsetTimestamp', 'offsetOrdinal'],
  fetcher: fetchThreadHistoryClient
});
export function useFetchThreadHistory({
  threadId,
  sessionId,
  offsetTimestamp,
  offsetOrdinal
}) {
  return useQuery(FETCH_THREAD_HISTORY_QUERY, {
    variables: {
      sessionId,
      threadId,
      offsetTimestamp,
      offsetOrdinal
    }
  });
}