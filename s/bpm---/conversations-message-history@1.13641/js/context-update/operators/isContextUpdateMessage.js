'use es6';

import {
    CONTEXT_UPDATE
} from '../constants/messageTypes';
import {
    getTopLevelType
} from '../../common-message-format/operators/commonMessageFormatGetters';
export const isContextUpdateMessage = message => {
    return getTopLevelType(message) === CONTEXT_UPDATE;
};