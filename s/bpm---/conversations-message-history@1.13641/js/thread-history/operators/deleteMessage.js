'use es6';

import curry from 'transmute/curry';
import {
    MESSAGE_RESULTS
} from '../constants/keyPaths';

/**
 * delete a message in a ThreadHistory
 *
 * @param {string} messageKey
 * @param {ThreadHistory} threadHistory
 * @returns {ThreadHistory}
 */
export const deleteMessage = curry((messageKey, threadHistory) => threadHistory.deleteIn(MESSAGE_RESULTS.concat(messageKey)));