'use es6';

import {
    getMessages
} from './getMessages';
export const lastMessage = threadHistory => getMessages(threadHistory).last();