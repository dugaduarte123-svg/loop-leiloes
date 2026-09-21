'use es6';

import {
    getTopLevelType
} from '../../common-message-format/operators/commonMessageFormatGetters';
import {
    INITIAL_MESSAGE
} from '../constants/messageType';
export const isInitialMessage = message => getTopLevelType(message) === INITIAL_MESSAGE;