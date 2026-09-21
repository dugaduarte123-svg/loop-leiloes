'use es6';

import {
    getTimestamp
} from '../../common-message-format/operators/commonMessageFormatGetters';
import {
    SESSION_EXPIRY_TIME_APPROXIMATION_IN_MS
} from '../constants/ThreadHistoryConstants';
export const getMessageIsApproximatelyFromCurrentSession = message => Date.now() - getTimestamp(message) < SESSION_EXPIRY_TIME_APPROXIMATION_IN_MS;