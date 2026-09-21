// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { TYPICAL_RESPONSE_TIME } from '../constants/messageTypes';
// FIXME Replace with a union type for messages

export const isTypicalResponseTimeMessage = message => getTopLevelType(message) === TYPICAL_RESPONSE_TIME;