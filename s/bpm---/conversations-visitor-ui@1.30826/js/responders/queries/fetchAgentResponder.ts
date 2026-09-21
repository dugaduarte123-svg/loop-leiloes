import { registerQuery } from 'data-fetching-client';
import Responder from 'conversations-internal-schema/responders/records/Responder';
import { fetchAgentResponder as fetchAgentResponderClient } from '../clients/fetchAgentResponder';
export const FETCH_AGENT_RESPONDER_QUERY = registerQuery({
  fieldName: 'fetchAgentResponder',
  args: ['senderId', 'agentType', 'sessionId', 'threadId'],
  fetcher: async args => Responder(await fetchAgentResponderClient(args))
});