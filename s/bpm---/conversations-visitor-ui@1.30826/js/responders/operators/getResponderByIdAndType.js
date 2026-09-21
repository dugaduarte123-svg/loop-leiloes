'use es6';

import {
    defaultMemoize
} from 'reselect';
import {
    buildResponderKey
} from './buildResponderKey';
export const getResponderByIdAndType = defaultMemoize(({
    responders,
    senderId,
    senderType
}) => {
    var _responders$get;
    if (!senderId || !senderType) {
        return null;
    }
    const key = buildResponderKey({
        senderId,
        senderType
    });
    return (_responders$get = responders.get(key)) !== null && _responders$get !== void 0 ? _responders$get : null;
});