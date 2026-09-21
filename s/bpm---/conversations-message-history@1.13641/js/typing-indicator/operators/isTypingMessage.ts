// @ts-ignore commonMessageFormatGetters are not typed
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { TYPING } from '../constants/messageTypes';
export const isTypingMessage = message => getTopLevelType(message) === TYPING;