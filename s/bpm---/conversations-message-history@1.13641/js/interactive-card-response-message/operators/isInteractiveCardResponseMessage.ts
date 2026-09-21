// @ts-ignore module not typed
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { INTERACTIVE_CARD_RESPONSE_MESSAGE } from '../constants/messageTypes';
export const isInteractiveCardResponseMessage = message => getTopLevelType(message) === INTERACTIVE_CARD_RESPONSE_MESSAGE;