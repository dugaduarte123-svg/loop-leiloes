'use es6';

import {
    getMessage
} from './getters';

/**
 * Returns either the message passed in directly to this function or
 * the `message` field on the argument. This is intended to be used
 * when dealing with messages that are either themselves pubsub messages
 * or wrappers around pubsub messages (e.g. ActivelyPublishing, FailedToPublish)
 *
 * @param {Record} pubSubOrUnpublishedMessage - the message
 * @returns {Record} - a pubSub message (e.g. CommonMessage)
 */
export const getPubSubMessage = pubSubOrUnpublishedMessage => {
    return getMessage(pubSubOrUnpublishedMessage) || pubSubOrUnpublishedMessage;
};