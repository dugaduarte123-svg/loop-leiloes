export const FETCH_AGENT_RESPONDER_SUCCEEDED = 'FETCH_AGENT_RESPONDER_SUCCEEDED';
export const fetchAgentResponderSucceeded = ({
  requestArgs,
  data
}) => ({
  type: FETCH_AGENT_RESPONDER_SUCCEEDED,
  payload: {
    requestArgs,
    data
  }
});