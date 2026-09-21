import curry from 'transmute/curry';
import updateIn from 'transmute/updateIn';
import { DIRECT_REPLIES } from '../constants/keyPaths';
export const mergeDirectReplies = curry((newDirectReplies, threadHistory) => updateIn(DIRECT_REPLIES, existingDirectReplies => newDirectReplies.mergeDeep(existingDirectReplies), threadHistory));