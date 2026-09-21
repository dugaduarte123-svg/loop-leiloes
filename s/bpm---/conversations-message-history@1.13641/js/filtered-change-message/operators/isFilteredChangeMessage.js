'use es6';

import {
    getTopLevelType
} from '../../common-message-format/operators/commonMessageFormatGetters';
import {
    FILTERED_CHANGE
} from '../constants/messageTypes';
export const isFilteredChangeMessage = message => getTopLevelType(message) === FILTERED_CHANGE;