// @ts-ignore module not typed
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { CUSTOMER_AGENT_AUTOMATED_MESSAGE } from '../constants/messageTypes';
export const isCustomerAgentAutomatedMessage = message => getTopLevelType(message) === CUSTOMER_AGENT_AUTOMATED_MESSAGE;