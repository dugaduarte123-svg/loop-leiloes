'use es6';

import deprecateFunction from '../../util/deprecateFunction';
import getIn from 'transmute/getIn';
import pipe from 'transmute/pipe';
import {
    SYSTEM_SENDER
} from '../constants/cmfSenderTypes';
import {
    AUDIT_PARAMS,
    CLIENT_TYPE,
    CONTENT_TYPE,
    DIRECT_REPLY_TO_MESSAGE_ID,
    ERROR_MESSAGE,
    HAS_STRIPPED_INLINE_IMAGES,
    ID,
    IN_REPLY_TO_ID,
    LOCALIZED_ERROR_KEY,
    MESSAGE_DELETE_STATUS,
    MESSAGE_DIRECTION,
    MESSAGE_ID,
    MESSAGE_SEND_FAILURE,
    MESSAGE_SEND_FAILURE_RETRYABLE,
    MESSAGE_SEND_FAILURE_SUBSCRIPTION_TYPE,
    MESSAGE_STATUS,
    MESSAGE_STATUS_TIMESTAMP,
    RICH_TEXT,
    SENDER,
    SENDER_TYPE,
    STRIPPED_ATTACHMENT_COUNT,
    TEXT,
    TIMESTAMP,
    TYPE
} from '../constants/keyPaths';
import {
    fromCmfSender
} from './cmfSenderInterop';
import * as CmfEmailMetadataGetters from './emailMetadataGetters';
import {
    getFileIds as getFileIdsFromAttachments
} from './fileAttachmentGetters';
import {
    getFileAttachments
} from './getFileAttachments';
import {
    getSenderKeyFromType
} from './getSenderKeyFromType';
import {
    getInlineImagesAttachment
} from './getInlineImagesAttachment';
import {
    getEmailMetadata
} from './getEmailMetadata';
export const getClientType = getIn(CLIENT_TYPE);
export const getId = getIn(ID);
export const getContentType = getIn(CONTENT_TYPE);
export const getPlainTextForCmf = getIn(TEXT);
export const getRichTextForCmf = getIn(RICH_TEXT);
export const getStatusForCmf = getIn(MESSAGE_STATUS);
export const getStatusTimestamp = getIn(MESSAGE_STATUS_TIMESTAMP);
export const getMessageIdForCmf = getIn(MESSAGE_ID);
export const getMessageDirection = getIn(MESSAGE_DIRECTION);
export const getAuditForCmf = getIn(AUDIT_PARAMS);
export const getStrippedAttachmentCount = getIn(STRIPPED_ATTACHMENT_COUNT);
export const getHasInlineImagesStripped = getIn(HAS_STRIPPED_INLINE_IMAGES);
export const getFileIds = pipe(getFileAttachments, getFileIdsFromAttachments);
export const getAttachmentStrippedCount = pipe(getFileAttachments, getStrippedAttachmentCount);
export const hasInlineImagesStripped = pipe(getInlineImagesAttachment, getHasInlineImagesStripped);
export const getTopLevelType = getIn(TYPE);
export const getInReplyToId = getIn(IN_REPLY_TO_ID);
export const getDirectReplyToMessageId = getIn(DIRECT_REPLY_TO_MESSAGE_ID);
const getTimestampForCMF = getIn(TIMESTAMP);
export const getSenderTypeForCMF = getIn(SENDER_TYPE);
const getMessageDeleteStatusForCmf = getIn(MESSAGE_DELETE_STATUS);
export const getMessageSendFailure = getIn(MESSAGE_SEND_FAILURE);
export const getMessageSendFailureRetryable = getIn(MESSAGE_SEND_FAILURE_RETRYABLE);
export const getMessageSendFailureSubscriptionType = getIn(MESSAGE_SEND_FAILURE_SUBSCRIPTION_TYPE);
export const getSender = getIn(SENDER);
export const getSenderKey = message => {
    const type = getSenderTypeForCMF(message);
    return getSenderKeyFromType(type);
};
const getSenderIdForCMF = message => {
    if (getSenderTypeForCMF(message) === SYSTEM_SENDER) {
        return null;
    }
    return getIn(['sender', getSenderKey(message)], message);
};
export const getSenderType = message => {
    return fromCmfSender(getSenderTypeForCMF(message));
};
export const getHasMetadata = message => !!getEmailMetadata(message);
export const getSubject = message => {
    return CmfEmailMetadataGetters.getSubject(message);
};
export const getFromAddress = message => {
    return CmfEmailMetadataGetters.getFromAddress(message);
};
export const getOriginalSenderEmail = message => {
    return CmfEmailMetadataGetters.getOriginalSenderEmail(message);
};
export const getOriginalSenderName = message => {
    return CmfEmailMetadataGetters.getOriginalSenderName(message);
};
export const getFromName = message => {
    return CmfEmailMetadataGetters.getFromName(message);
};

// TODO: Remove references to this operator. It's misleading
export const getAttachments = deprecateFunction('Use fileAttachmentGetters instead.', message => {
    return getFileIds(message);
});
export const getConnectedAccountAddress = message => {
    return CmfEmailMetadataGetters.getConnectedAccountAddress(message);
};
export const getHasReplies = message => CmfEmailMetadataGetters.getHasReplies(message);
export const getPreviousRepliesHtml = message => CmfEmailMetadataGetters.getPreviousRepliesHtml(message);
export const getPreviousRepliesPlainText = message => CmfEmailMetadataGetters.getPreviousRepliesPlainText(message);
export const getIsMemberOfForwardedSubthread = message => CmfEmailMetadataGetters.getIsMemberOfForwardedSubthread(message);
export const getIsForward = message => CmfEmailMetadataGetters.getIsForward(message);
export const getLocalizedErrorKey = getIn(LOCALIZED_ERROR_KEY);
export const getErrorMessage = getIn(ERROR_MESSAGE);
export {
    getAuditForCmf as getAudit, getMessageDeleteStatusForCmf as getMessageDeleteStatus, getMessageIdForCmf as getEmailMessageId, getPlainTextForCmf as getPlainText, getRichTextForCmf as getRichText, getSenderIdForCMF as getSenderId, getStatusForCmf as getStatus, getTimestampForCMF as getTimestamp, getTopLevelType as getType
};