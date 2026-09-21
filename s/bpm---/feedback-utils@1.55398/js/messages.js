'use es6';

import {
    frameListener
} from './subscriptions/messages';
import * as MessageTypes from 'feedback-schema/constants/messageTypes';
export const FEEDBACK_TYPE = 'hubspot-servicehub-feedback';
const getSender = (channel, targetWindow, targetOrigin) => (messageType, payload) => {
    targetWindow.postMessage(JSON.stringify({
        payload: {
            channel,
            payload: {
                messageType,
                payload
            }
        },
        type: FEEDBACK_TYPE
    }), targetOrigin || '*');
};
export const iframeSender = (iframe, channel) => getSender(channel, iframe.contentWindow, iframe.src);
export const parentSender = channel => getSender(channel, window.parent, document.referrer);
export const onFrameReady = (frame, channel, callback) => {
    const subscribe = frameListener(frame, channel);
    const sender = iframeSender(frame, channel);
    const unsubscribe = subscribe(type => {
        if (type === MessageTypes.READY) {
            callback({
                sender,
                subscribe
            });
            unsubscribe();
        }
    });
};