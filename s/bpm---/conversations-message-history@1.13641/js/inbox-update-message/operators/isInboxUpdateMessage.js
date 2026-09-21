'use es6';

import {
    getTopLevelType
} from '../../common-message-format/operators/commonMessageFormatGetters';
import {
    THREAD_INBOX_UPDATED
} from '../constants/messageTypes';
export const isInboxUpdateMessage = message => getTopLevelType(message) === THREAD_INBOX_UPDATED;