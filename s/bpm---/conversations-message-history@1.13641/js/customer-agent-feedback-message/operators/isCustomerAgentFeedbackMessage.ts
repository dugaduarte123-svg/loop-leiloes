// @ts-ignore module not typed
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { CUSTOMER_AGENT_FEEDBACK_MESSAGE } from '../constants/messageTypes';
export const isCustomerAgentFeedbackMessage = message => getTopLevelType(message) === CUSTOMER_AGENT_FEEDBACK_MESSAGE;
export const isCustomerAgentFeedbackMessageRecord = message => message['@type'] === CUSTOMER_AGENT_FEEDBACK_MESSAGE;