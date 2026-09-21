import get from 'transmute/get';
import { COMPLETED_MESSAGE_ID, PARTIAL_ORDINAL, PARTIAL_MESSAGE_TYPE, COMPLETED_MESSAGE_TIMESTAMP, MESSAGE_TEXT, ID } from '../constants/messageKeys';
export const getGenericChannelId = get('genericChannelId');
export const getCompletedMessageId = get(COMPLETED_MESSAGE_ID);
export const getPartialOrdinal = get(PARTIAL_ORDINAL);
export const getPartialMessageType = get(PARTIAL_MESSAGE_TYPE);
export const getCompletedMessageTimestamp = get(COMPLETED_MESSAGE_TIMESTAMP);
export const getPartialMessageText = get(MESSAGE_TEXT);
export const getPartialMessageId = get(ID);