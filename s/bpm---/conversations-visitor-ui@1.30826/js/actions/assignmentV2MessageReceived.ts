import { getAssignedAgentId, getAssignedAgentType
// @ts-ignore untyped-file
} from 'conversations-message-history/assignment-update-message/operators/assignmentGetters';
import { fetchAgentResponderIfNecessary } from './AgentResponderActions';
import { defaultMessageReceived } from './defaultMessageReceived';
export function assignmentV2MessageReceived(message, channel, threadId) {
  return dispatch => {
    const assignedAgentId = getAssignedAgentId(message);
    const agentType = getAssignedAgentType(message);
    if (assignedAgentId && threadId) {
      dispatch(fetchAgentResponderIfNecessary({
        senderId: assignedAgentId,
        agentType,
        threadId
      }));
    }
    dispatch(defaultMessageReceived(message, channel, threadId));
  };
}