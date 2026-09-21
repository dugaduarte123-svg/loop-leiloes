'use es6';

import get from 'transmute/get';
import {
    QUICK_REPLIES
} from '../constants/attachmentTypes';
import {
    getAttachments
} from './getAttachments';
import {
    getAllowMultiSelect as getAllowMultiSelectFromQuickReply,
    getAllowUserInput as getAllowUserInputFromQuickReply,
    getQuickReplies as getQuickRepliesFromQuickReply
} from './quickReplyAttachmentGetters';
export const getQuickReplyAttachment = commonMessage => {
    const attachments = getAttachments(commonMessage);
    if (!attachments) {
        return undefined;
    }
    const quickReplyAttachment = attachments.find(attachmentObject => get('@type', attachmentObject) === QUICK_REPLIES);
    return quickReplyAttachment;
};
export const getQuickReply = message => {
    return getQuickReplyAttachment(message);
};
export const getQuickReplyAllowMultiSelect = message => {
    const quickReplyAttachment = getQuickReplyAttachment(message);
    return getAllowMultiSelectFromQuickReply(quickReplyAttachment);
};
export const getQuickReplyAllowUserInput = message => {
    const quickReplyAttachment = getQuickReplyAttachment(message);
    return getAllowUserInputFromQuickReply(quickReplyAttachment);
};
export const getQuickReplyReplies = message => {
    const quickReplyAttachment = getQuickReplyAttachment(message);
    return getQuickRepliesFromQuickReply(quickReplyAttachment);
};