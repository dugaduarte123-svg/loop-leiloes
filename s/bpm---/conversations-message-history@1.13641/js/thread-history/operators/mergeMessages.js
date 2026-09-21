'use es6';

import curry from 'transmute/curry';
import pipe from 'transmute/pipe';
import updateIn from 'transmute/updateIn';
import {
    MESSAGE_RESULTS
} from '../constants/keyPaths';
export const mergeMessages = curry((newMessages, threadHistory) => updateIn(MESSAGE_RESULTS, pipe(existingMessages => newMessages.merge(existingMessages)), threadHistory));