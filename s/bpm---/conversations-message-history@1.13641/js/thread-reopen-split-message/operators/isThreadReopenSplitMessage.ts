// @ts-ignore dependency missing types
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { THREAD_REOPEN_SPLIT_MESSAGE } from '../constants/messageTypes';
export const isThreadReopenSplitMessage = message => getTopLevelType(message) === THREAD_REOPEN_SPLIT_MESSAGE;