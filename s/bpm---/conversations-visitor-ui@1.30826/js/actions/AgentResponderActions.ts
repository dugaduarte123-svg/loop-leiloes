import { agentTypeToSenderType } from 'conversations-message-history/senders/operators/agentTypeToSenderType';
//@ts-ignore untyped-file
import { getResponderByIdAndType } from '../responders/operators/getResponderByIdAndType';
import { getResponders } from '../responders/selectors/getResponders';
import { getSessionId } from '../selectors/widgetDataSelectors/getSessionId';
import { getUserId } from 'conversations-internal-schema/responders/operators/responderGetters';
//@ts-ignore untyped-file
import { getCurrentThreadId } from '../thread-history/selectors/getCurrentThreadId';
import { dataFetchingClient } from '../data-fetching-client/dataFetchingClient';
import { FETCH_AGENT_RESPONDER_QUERY } from '../responders/queries/fetchAgentResponder';
import { fetchAgentResponderSucceeded } from '../responders/constants/asyncActionTypes';
import { buildRequestErrorMetaObject } from 'conversations-error-reporting/error-actions/builders/buildRequestErrorMetaObject';
export const fetchAgentResponderIfNecessary = ({
  senderId,
  agentType,
  threadId: threadIdOverride
}) => {
  return (dispatch, getState) => {
    const responders = getResponders(getState());
    const senderType = agentTypeToSenderType(agentType);
    const responder = getResponderByIdAndType({
      responders,
      senderId,
      senderType
    });
    const responderId = getUserId(responder);
    const threadId = threadIdOverride !== null && threadIdOverride !== void 0 ? threadIdOverride : getCurrentThreadId(getState());
    if (!senderId || responderId || !threadId) {
      return;
    }
    const requestArgs = {
      senderId,
      agentType,
      sessionId: getSessionId(getState()),
      threadId
    };
    dataFetchingClient.query({
      query: FETCH_AGENT_RESPONDER_QUERY,
      variables: requestArgs
    }).then(result => {
      dispatch(fetchAgentResponderSucceeded({
        requestArgs,
        data: result.data.fetchAgentResponder
      }));
    }).catch(err => {
      dispatch(buildRequestErrorMetaObject(err));
    });
  };
};