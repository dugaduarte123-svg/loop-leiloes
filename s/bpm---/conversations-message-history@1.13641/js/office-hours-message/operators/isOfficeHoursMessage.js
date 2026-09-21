'use es6';

import {
    getTopLevelType
} from '../../common-message-format/operators/commonMessageFormatGetters';
import {
    OFFICE_HOURS
} from '../constants/messageTypes';
export const isOfficeHoursMessage = message => getTopLevelType(message) === OFFICE_HOURS;