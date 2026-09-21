import set from 'transmute/set';
import { COMPLETED_MESSAGE_ID, PARTIAL_ORDINAL, PARTIAL_MESSAGE_TYPE, COMPLETED_MESSAGE_TIMESTAMP } from '../constants/messageKeys';
export const setCompletedMessageId = set(COMPLETED_MESSAGE_ID);
export const setPartialOrdinal = set(PARTIAL_ORDINAL);
export const setPartialMessageType = set(PARTIAL_MESSAGE_TYPE);
export const setCompletedMessageTimestamp = set(COMPLETED_MESSAGE_TIMESTAMP);