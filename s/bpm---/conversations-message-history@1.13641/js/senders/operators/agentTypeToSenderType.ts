import * as AgentTypes from '../../common-message-format/constants/agentTypes';
import * as SenderTypes from '../../common-message-format/constants/legacySenderTypes';
import * as CmfSenderTypes from '../../common-message-format/constants/cmfSenderTypes';
const agentToSenderMapping = {
  [AgentTypes.HUMAN]: SenderTypes.AGENT,
  [AgentTypes.BOT]: SenderTypes.BOT
};
const agentToCMFSenderMapping = {
  [AgentTypes.HUMAN]: CmfSenderTypes.AGENT_SENDER,
  [AgentTypes.BOT]: CmfSenderTypes.BOT_SENDER
};
export const agentTypeToSenderType = agentType => {
  return agentToSenderMapping[agentType];
};
export const agentTypeToCMFSenderType = agentType => {
  return agentToCMFSenderMapping[agentType];
};