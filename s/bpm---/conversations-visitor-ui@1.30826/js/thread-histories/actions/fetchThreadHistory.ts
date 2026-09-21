import Raven from 'raven-js';
import { BOT as BOT_SENDER_TYPE } from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import { INTERACTIVE_CARD } from 'conversations-message-history/common-message-format/constants/attachmentTypes';
import { getAttachmentWithType } from 'conversations-message-history/common-message-format/operators/commonMessageGetters';
import { HUMAN as HUMAN_AGENT_TYPE, BOT as BOT_AGENT_TYPE } from 'conversations-message-history/common-message-format/constants/agentTypes';
import { getMessages } from 'conversations-message-history/thread-history/operators/getters';
import { fileAttachmentIdsInMessage } from 'conversations-message-history/common-message-format/operators/fileAttachmentIdsInMessage';

// @ts-ignore untyped-dependency
import { prepareThreadHistoryResponse } from '../operators/prepareThreadHistoryResponse';
// @ts-ignore untyped-dependency
import { getSenderPairs } from '../operators/getSenderPairs';
import { fetchAgentResponderIfNecessary } from '../../actions/AgentResponderActions';
import { dataFetchingClient } from '../../data-fetching-client/dataFetchingClient';
import { FETCH_THREAD_HISTORY_QUERY } from '../hooks/useFetchThreadHistory';
import { threadHistoryFetchStarted, threadHistoryFetched, threadHistoryFetchFailed } from '../constants/ActionTypes';
import { resolveInteractiveCardForMessage } from '../../interactive-cards/actions/resolveInteractiveCardForMessage';
import { ResolveThreadAttachments } from '../../resolved-attachments/resources/resolveThreadAttachmentsResource';
export function fetchThreadHistory({
  offsetOrdinal,
  offsetTimestamp,
  threadId,
  sessionId
}) {
  return dispatch => {
    if (!threadId) {
      return Promise.resolve();
    }
    dispatch(threadHistoryFetchStarted({
      threadId
    }));
    return dataFetchingClient.query({
      query: FETCH_THREAD_HISTORY_QUERY,
      variables: {
        offsetOrdinal,
        offsetTimestamp,
        threadId,
        sessionId
      }
    }).then(result => {
      var _getMessages, _getMessages2;
      const {
        threadHistory,
        hasVisitorEmail
      } = prepareThreadHistoryResponse(result.data.fetchThreadHistory);
      const responders = getSenderPairs(threadHistory);

      // Fire Pulse prefetches BEFORE dispatching to Redux. React-Redux's
      // useSyncExternalStore triggers inline re-renders on dispatch, so any
      // getPromise calls after dispatch are too late to precede the first render.
      (_getMessages = getMessages(threadHistory)) === null || _getMessages === void 0 || _getMessages.valueSeq().forEach(message => {
        const fileIds = fileAttachmentIdsInMessage(message).toArray().sort((a, b) => a - b);
        if (fileIds.length > 0 && sessionId) {
          void ResolveThreadAttachments.getPromise({
            threadId,
            sessionId,
            fileIds
          }).catch(() => {});
        }
      });
      dispatch(threadHistoryFetched({
        threadId,
        threadHistory,
        hasVisitorEmail
      }));
      (_getMessages2 = getMessages(threadHistory)) === null || _getMessages2 === void 0 || _getMessages2.valueSeq().forEach(message => {
        const cardAttachment = getAttachmentWithType(INTERACTIVE_CARD, message);
        const cardInstanceId = cardAttachment === null || cardAttachment === void 0 ? void 0 : cardAttachment.get('cardInstanceId');
        if (cardInstanceId) {
          void dispatch(resolveInteractiveCardForMessage({
            cardInstanceId,
            threadId
          }));
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responders.forEach(senderPair => {
        const senderId = senderPair.get('senderId');
        const senderType = senderPair.get('senderType');
        const agentType = senderType === BOT_SENDER_TYPE ? BOT_AGENT_TYPE : HUMAN_AGENT_TYPE;
        dispatch(fetchAgentResponderIfNecessary({
          senderId,
          agentType
        }));
      });
    }).catch(error => {
      dispatch(threadHistoryFetchFailed({
        threadId
      }));
      Raven.captureException(error);
    });
  };
}