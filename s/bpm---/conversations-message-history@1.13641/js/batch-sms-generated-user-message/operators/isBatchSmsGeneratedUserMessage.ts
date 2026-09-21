// @ts-ignore dependency missing types
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { BATCH_SMS_GENERATED_USER_MESSAGE } from '../constants/messageTypes';
export const isBatchSmsGeneratedUserMessage = message => getTopLevelType(message) === BATCH_SMS_GENERATED_USER_MESSAGE;