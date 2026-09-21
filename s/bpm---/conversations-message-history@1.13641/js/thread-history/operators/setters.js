'use es6';

import setIn from 'transmute/setIn';
import {
    VISITOR_LAST_READ_AT_TIMESTAMP,
    NUM_SOFT_DELETED_MESSAGES,
    MESSAGE_RESULTS,
    MESSAGES,
    MESSAGE_OFFSET,
    OFFSET_TIMESTAMP,
    OFFSET_ORDINAL,
    MESSAGE_HAS_MORE,
    ATTACHMENTS,
    FILE_ATTACHMENTS,
    FRIENDLY_NAME_RESULTS
} from '../constants/keyPaths';
export const setMessagesBase = setIn(MESSAGES);
export const setHasMore = setIn(MESSAGE_HAS_MORE);
export const setOffset = setIn(MESSAGE_OFFSET);
export const setOffsetTimestamp = setIn(OFFSET_TIMESTAMP);
export const setOffsetOrdinal = setIn(OFFSET_ORDINAL);
export const setMessages = setIn(MESSAGE_RESULTS);
export const setVisitorLastReadAtTimestamp = setIn(VISITOR_LAST_READ_AT_TIMESTAMP);
export const setNumSoftDeletedMessages = setIn(NUM_SOFT_DELETED_MESSAGES);
export const setAttachments = setIn(ATTACHMENTS);
export const setFileAttachments = setIn(FILE_ATTACHMENTS);
export const setFriendlyNameResults = setIn(FRIENDLY_NAME_RESULTS);