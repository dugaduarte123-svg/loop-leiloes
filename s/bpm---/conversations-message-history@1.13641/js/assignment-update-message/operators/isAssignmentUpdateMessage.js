'use es6';

import {
    getTopLevelType
} from '../../common-message-format/operators/commonMessageFormatGetters';
import {
    ASSIGNMENT_UPDATE
} from '../constants/messageTypes';
export const isAssignmentUpdateMessage = message => getTopLevelType(message) === ASSIGNMENT_UPDATE;