// @ts-ignore module not typed
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { SMS_CONSENT_AUTOMATED_MESSAGE } from '../constants/messageTypes';
export const isSmsConsentAutomatedMessage = message => getTopLevelType(message) === SMS_CONSENT_AUTOMATED_MESSAGE;