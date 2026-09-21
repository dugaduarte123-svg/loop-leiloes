//@ts-ignore file not typed
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { CUSTOMER_AGENT_ACTION_EXECUTION_MESSAGE } from '../constants/messageTypes';
export const isCustomerAgentActionExecutionMessage = message => getTopLevelType(message) === CUSTOMER_AGENT_ACTION_EXECUTION_MESSAGE;