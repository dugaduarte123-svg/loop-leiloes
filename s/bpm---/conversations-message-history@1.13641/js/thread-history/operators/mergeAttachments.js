'use es6';

import curry from 'transmute/curry';
import pipe from 'transmute/pipe';
import updateIn from 'transmute/updateIn';
import {
    ATTACHMENTS
} from '../constants/keyPaths';
export const mergeAttachments = curry((newAttachments, threadHistory) => updateIn(ATTACHMENTS, pipe(existingAttachments => newAttachments.mergeDeep(existingAttachments)), threadHistory));