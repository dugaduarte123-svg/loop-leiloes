// @ts-ignore module not typed
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { MESSAGE_REJECTED } from '../constants/messageTypes';
export const isRejectedMessage = message => getTopLevelType(message) === MESSAGE_REJECTED;