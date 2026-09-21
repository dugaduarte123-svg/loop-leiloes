'use es6';

import {
    isThreadStatusUpdateMessage
} from './isThreadStatusUpdateMessage';
import {
    getCurrentStatus
} from '../../thread-status-update/operators/threadStatusUpdateMessageGetters';
import ChatFilterOptions from 'conversations-internal-schema/constants/ChatFilterOptions';
export const isOpenThreadMessage = message => isThreadStatusUpdateMessage(message) && getCurrentStatus(message) === ChatFilterOptions.STARTED;