'use es6';

import {
    isEmailCapturePromptMessage
} from 'conversations-message-history/email-capture-prompt/operators/isEmailCapturePromptMessage';
import {
    isEmailCaptureResponseMessage
} from 'conversations-message-history/email-capture-response/operators/isEmailCaptureResponseMessage';
import {
    isOfficeHoursMessage
} from 'conversations-message-history/office-hours-message/operators/isOfficeHoursMessage';
import {
    isTypicalResponseTimeMessage
} from 'conversations-message-history/typical-response-time/operators/isTypicalResponseTimeMessage';
import {
    isAvailabilityAutoReplyMessage
} from 'conversations-message-history/availability-auto-reply/operators/isAvailabilityAutoReplyMessage';
import {
    isFromVisitor
} from 'conversations-message-history/common-message-format/operators/senderTypeComparators';
export const sentByVisitorClient = message => {
    return isFromVisitor(message) || isEmailCapturePromptMessage(message) || isEmailCaptureResponseMessage(message) || isTypicalResponseTimeMessage(message) || isOfficeHoursMessage(message) || isAvailabilityAutoReplyMessage(message);
};