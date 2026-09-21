'use es6';

import {
    FAILED
} from '../constants/statusTypes';
import {
    getId,
    getMessageSendFailure,
    getStatusForCmf,
    getTimestamp
} from './commonMessageFormatGetters';
import {
    isCommonMessageFormat
} from './cmfComparators';
import FailedToPublish from '../../unpublished-messages/records/FailedToPublish';
import curry from 'transmute/curry';
export const wrapFailedMessage = curry(({
    threadId,
    channel,
    allowRetry = true
}, message) => {
    if (isCommonMessageFormat(message) && getStatusForCmf(message) === FAILED) {
        const sendFailure = getMessageSendFailure(message);
        const isMessageRetryable = !sendFailure || sendFailure.get('retryable');
        return FailedToPublish({
            id: getId(message),
            message,
            threadId,
            channel,
            genericChannelId: message.genericChannelId || null,
            allowRetry: allowRetry && isMessageRetryable,
            timestamp: getTimestamp(message)
        });
    }
    return message;
});