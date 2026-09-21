'use es6';

import {
    FEEDBACK_TYPE
} from '../messages';
import {
    getOrigin
} from '../urls';
import eventAggregator from './events';
const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const messageAggregator = (url, channel) => {
    const rawOrigin = getOrigin(url);
    if (rawOrigin === null) {
        return () => {};
    }
    const testOrigin = new RegExp(`^${escapeRegExp(rawOrigin)}$`);
    const subscribe = eventAggregator(window, 'message');
    return subscriber => subscribe(({
        data,
        origin,
        source
    }) => {
        if (!(data && testOrigin.test(origin))) return;
        let message;
        try {
            message = JSON.parse(data);
        } catch (e) {
            return;
        }
        const {
            payload: payload1,
            type
        } = message;
        if (!(payload1 && type === FEEDBACK_TYPE)) return;
        const {
            channel: messageChannel,
            payload: {
                messageType,
                payload: payload2
            }
        } = payload1;
        if (messageChannel !== channel) return;
        subscriber(messageType, payload2, origin, source);
    });
};
export const parentListener = channel => messageAggregator(document.referrer, channel);
export const frameListener = (iframe, channel) => messageAggregator(iframe.src, channel);
export default messageAggregator;