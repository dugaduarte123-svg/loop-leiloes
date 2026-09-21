'use es6';

import invariant from 'react-utils/invariant';
import CommonMessage from 'conversations-message-history/common-message-format/records/CommonMessage';
import ContextUpdateMessage from 'conversations-message-history/context-update/records/ContextUpdateMessage';
import InitialMessage from 'conversations-message-history/initial-message/records/InitialMessage';
import FailedToPublish from 'conversations-message-history/unpublished-messages/records/FailedToPublish';
import TypingIndicatorMessage from 'conversations-message-history/typing-indicator/records/TypingIndicatorMessage';
import EmailCapturePromptMessage from 'conversations-message-history/email-capture-prompt/records/EmailCapturePromptMessage';
import EmailCaptureResponseMessage from 'conversations-message-history/email-capture-response/records/EmailCaptureResponseMessage';
import OfficeHoursMessage from 'conversations-message-history/office-hours-message/records/OfficeHoursMessage';
import ReadThreadMessage from 'conversations-message-history/read-thread-message/records/ReadThreadMessage';
import ThreadStatusUpdateMessage from 'conversations-message-history/thread-status-update/records/ThreadStatusUpdateMessage';
import TypicalResponseTimeMessage from 'conversations-message-history/typical-response-time/records/TypicalResponseTimeMessage';
import AvailabilityAutoReplyMessage from 'conversations-message-history/availability-auto-reply/records/AvailabilityAutoReplyMessage';
import AssignmentUpdateMessage from 'conversations-message-history/assignment-update-message/records/AssignmentUpdateMessage';
import FeedbackSurveyMessage from 'conversations-message-history/feedback-survey-message/records/FeedbackSurveyMessage';
import PartialMessage from 'conversations-message-history/partial-message/records/PartialMessage';
import CustomerAgentMaintenanceModeMessage from 'conversations-message-history/customer-agent-maintenance-mode-message/records/CustomerAgentMaintenanceModeMessage';
import CustomerAgentAutomatedMessage from 'conversations-message-history/customer-agent-automated-message/records/CustomerAgentAutomatedMessage';
import CustomerAgentFeedbackMessage from 'conversations-message-history/customer-agent-feedback-message/records/CustomerAgentFeedbackMessage';
import InteractiveCardRequestMessage from 'conversations-message-history/interactive-card-request-message/records/InteractiveCardRequestMessage';
import {
    getRecordName
} from '../../utils/getRecordName';
const validRecordTypes = [AssignmentUpdateMessage, AvailabilityAutoReplyMessage, CommonMessage, ContextUpdateMessage, FailedToPublish, InitialMessage, TypingIndicatorMessage, EmailCapturePromptMessage, EmailCaptureResponseMessage, OfficeHoursMessage, ReadThreadMessage, ThreadStatusUpdateMessage, TypicalResponseTimeMessage, FeedbackSurveyMessage, PartialMessage, CustomerAgentMaintenanceModeMessage, CustomerAgentAutomatedMessage, CustomerAgentFeedbackMessage, InteractiveCardRequestMessage];
export const historyMessageInvariant = message => invariant(validRecordTypes.some(type => message instanceof type), `Expected message to be one of ${validRecordTypes.map(record => getRecordName(record)).join(', ')}, not a %s`, typeof message);