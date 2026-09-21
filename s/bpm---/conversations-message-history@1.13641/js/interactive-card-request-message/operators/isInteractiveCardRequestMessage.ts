// @ts-ignore module not typed
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { INTERACTIVE_CARD_REQUEST_MESSAGE } from '../constants/messageTypes';
export const isInteractiveCardRequestMessage = message => getTopLevelType(message) === INTERACTIVE_CARD_REQUEST_MESSAGE;