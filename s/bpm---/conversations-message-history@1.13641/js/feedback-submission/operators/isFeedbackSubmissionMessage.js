'use es6';

import {
    getTopLevelType
} from '../../common-message-format/operators/commonMessageFormatGetters';
import {
    FEEDBACK_SUBMISSION
} from '../constants/messageTypes';
export const isFeedbackSubmissionMessage = message => getTopLevelType(message) === FEEDBACK_SUBMISSION;