// @ts-ignore module not typed
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { CUSTOMER_AGENT_MAINTENANCE_MODE_MESSAGE } from '../constants/messageTypes';
export const isCustomerAgentMaintenanceModeMessage = message => getTopLevelType(message) === CUSTOMER_AGENT_MAINTENANCE_MODE_MESSAGE;