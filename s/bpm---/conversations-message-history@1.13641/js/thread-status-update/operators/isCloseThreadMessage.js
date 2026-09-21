'use es6';

import {
    isThreadStatusUpdateMessage
} from './isThreadStatusUpdateMessage';
import {
    hasThreadBeenClosed
} from './hasThreadBeenClosed';
export const isCloseThreadMessage = message => isThreadStatusUpdateMessage(message) && hasThreadBeenClosed(message);