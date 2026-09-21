'use es6';

import some from 'transmute/some';
import {
    isFromBot
} from '../../common-message-format/operators/senderTypeComparators';
import {
    getMessages
} from './getMessages';
import {
    hasMessages
} from './hasMessages';
export const hasBotMessages = threadHistory => hasMessages(threadHistory) && some(isFromBot, getMessages(threadHistory));