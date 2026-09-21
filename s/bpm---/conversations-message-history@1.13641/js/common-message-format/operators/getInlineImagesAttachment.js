'use es6';

import {
    getAttachments
} from './getAttachments';
import {
    INLINE_IMAGES
} from '../constants/attachmentTypes';
import get from 'transmute/get';
import {
    List
} from 'immutable';
export const getInlineImagesAttachment = message => {
    const attachments = getAttachments(message);
    if (attachments) {
        const fileAttachment = attachments.find(attachment => get('@type', attachment) === INLINE_IMAGES);
        return fileAttachment && fileAttachment.size >= 1 ? fileAttachment : List();
    }
    return List();
};