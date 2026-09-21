'use es6';

import {
    getCurrentStatus,
    getPreviousStatus
} from './threadStatusUpdateMessageGetters';
import ChatFilterOptions from 'conversations-internal-schema/constants/ChatFilterOptions';
export const hasThreadBeenClosed = message => {
    const prevStatus = getPreviousStatus(message);
    const currentStatus = getCurrentStatus(message);
    return prevStatus === ChatFilterOptions.STARTED && currentStatus === ChatFilterOptions.ENDED;
};