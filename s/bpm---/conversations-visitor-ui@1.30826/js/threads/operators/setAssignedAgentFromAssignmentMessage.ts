import setIn from 'transmute/setIn';
import { ASSIGNED_AGENT_ID } from '../../threads/constants/KeyPaths';
import curry from 'transmute/curry';
// @ts-ignore untyped-file
import { getAssignedAgentId } from 'conversations-message-history/assignment-update-message/operators/assignmentGetters';
export const setAssignedAgentId = setIn(ASSIGNED_AGENT_ID);
export const setAssignedAgentFromAssignmentMessage = curry((assignmentMessage, thread) => {
  const agentId = getAssignedAgentId(assignmentMessage);
  return setAssignedAgentId(agentId, thread);
});