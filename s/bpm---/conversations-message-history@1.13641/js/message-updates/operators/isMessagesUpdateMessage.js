'use es6';

import get from 'transmute/get';
import {
    MESSAGES_UPDATED
} from '../constants/messageTypes';
export const isMessagesUpdateMessage = message => {
    return get('@type', message) === MESSAGES_UPDATED;
};