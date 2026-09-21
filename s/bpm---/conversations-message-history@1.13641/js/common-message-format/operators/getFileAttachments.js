'use es6';

import get from 'transmute/get';
import {
    List
} from 'immutable';
import {
    FILES
} from '../constants/attachmentTypes';
import {
    getAttachments
} from './getAttachments';
export const getFileAttachments = commonMessage => {
    const attachments = getAttachments(commonMessage);
    if (attachments) {
        const fileAttachment = attachments.find(attachmentObject => get('@type', attachmentObject) === FILES);
        return fileAttachment;
    } else {
        return List();
    }
};