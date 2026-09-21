'use es6';

import setIn from 'transmute/setIn';
import get from 'transmute/get';
import {
    ATTACHMENTS,
    CLIENT_TYPE,
    CONTENT_TYPE,
    ID,
    MESSAGE_DELETE_STATUS,
    MESSAGE_STATUS,
    MESSAGE_STATUS_TIMESTAMP,
    RICH_TEXT,
    SENDER,
    SENDER_TYPE,
    STATUS,
    TEXT,
    TIMESTAMP,
    IN_REPLY_TO_ID,
    RECIPIENTS
} from '../constants/keyPaths';
import {
    EMAIL_METADATA
} from '../constants/attachmentTypes';
import {
    List as ImmutableList
} from 'immutable';
export const setClientType = setIn(CLIENT_TYPE);
export const setId = setIn(ID);
export const setStatus = setIn(STATUS);
export const setMessageStatus = setIn(MESSAGE_STATUS);
export const setMessageStatusTimestamp = setIn(MESSAGE_STATUS_TIMESTAMP);
export const setMessageDeletedStatus = setIn(MESSAGE_DELETE_STATUS);
export const setTimestamp = setIn(TIMESTAMP);
export const setAttachments = setIn(ATTACHMENTS);
export const setEmailMetadataAttachment = (commonMessage, emailMetadata) => {
    const attachments = get('attachments', commonMessage);
    const newAttachments = attachments.reduce((acc, attachment) => {
        if (get('@type', attachment) === EMAIL_METADATA) {
            acc = acc.push(emailMetadata);
        } else {
            acc = acc.push(attachment);
        }
        return acc;
    }, ImmutableList());
    return setAttachments(newAttachments, commonMessage);
};
export const setContentType = setIn(CONTENT_TYPE);
export const setSender = setIn(SENDER);
export const setSenderType = setIn(SENDER_TYPE);
export const setText = setIn(TEXT);
export const setRichText = setIn(RICH_TEXT);
export const setInReplyToId = setIn(IN_REPLY_TO_ID);
export const setRecipients = setIn(RECIPIENTS);