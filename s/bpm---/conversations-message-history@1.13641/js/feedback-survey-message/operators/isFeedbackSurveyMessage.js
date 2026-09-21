'use es6';

import {
    getTopLevelType
} from '../../common-message-format/operators/commonMessageFormatGetters';
import {
    FEEDBACK_SURVEY
} from '../constants/messageTypes';
export const isFeedbackSurveyMessage = message => getTopLevelType(message) === FEEDBACK_SURVEY;