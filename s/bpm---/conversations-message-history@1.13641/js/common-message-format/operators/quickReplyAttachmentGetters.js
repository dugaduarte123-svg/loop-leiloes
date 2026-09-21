'use es6';

import getIn from 'transmute/getIn';
import {
    ALLOW_MULTI_SELECT,
    ALLOW_USER_INPUT,
    QUICK_REPLIES
} from '../constants/quickReplyAttachmentKeyPaths';
export const getAllowMultiSelect = getIn(ALLOW_MULTI_SELECT);
export const getAllowUserInput = getIn(ALLOW_USER_INPUT);
export const getQuickReplies = getIn(QUICK_REPLIES);