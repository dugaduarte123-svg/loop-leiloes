import { List as ImmutableList } from 'immutable';
import { getUserId } from 'conversations-internal-schema/responders/operators/responderGetters';
import { getAssignedAgentId, getResponder } from './threadGetters';
export const findAssignedResponder = ({
  thread,
  responders = ImmutableList(),
  botResponder
}) => {
  if (!thread && !botResponder) {
    return null;
  }
  const initialAssignedResponder = getResponder(thread);
  const respondersList = responders || ImmutableList();
  const assignedAgent = respondersList.find(responder => `${getUserId(responder)}` === `${getAssignedAgentId(thread)}`);
  return assignedAgent || botResponder || initialAssignedResponder || null;
};