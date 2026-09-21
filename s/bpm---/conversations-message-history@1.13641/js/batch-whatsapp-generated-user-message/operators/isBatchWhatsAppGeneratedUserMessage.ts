// @ts-expect-error dependency missing types
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { BATCH_WHATSAPP_GENERATED_USER_MESSAGE } from '../constants/messageTypes';
export const isBatchWhatsAppGeneratedUserMessage = message => getTopLevelType(message) === BATCH_WHATSAPP_GENERATED_USER_MESSAGE;