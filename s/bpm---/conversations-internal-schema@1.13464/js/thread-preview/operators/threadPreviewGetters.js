'use es6';

import getIn from 'transmute/getIn';
import {
    HAS_FILE_ATTACHMENT,
    PREVIEW_TEXT,
    FAILED,
    RESPONDER,
    VISITOR
} from '../constants/threadPreviewKeyPaths';
export const getHasFileAttachment = getIn(HAS_FILE_ATTACHMENT);
export const getPreviewText = getIn(PREVIEW_TEXT);
export const getFailed = getIn(FAILED);
export const getResponder = getIn(RESPONDER);
export const getVisitor = getIn(VISITOR);