// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { AVAILABILITY_AUTO_REPLY } from '../constants/messageTypes';
export const isAvailabilityAutoReplyMessage = message => getTopLevelType(message) === AVAILABILITY_AUTO_REPLY;