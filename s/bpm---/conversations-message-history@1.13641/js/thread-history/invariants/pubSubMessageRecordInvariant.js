'use es6';

import CommentMessage from '../../comment-message/records/CommentMessage';
import CommonMessage from '../../common-message-format/records/CommonMessage';
import ContextUpdateMessage from '../../context-update/records/ContextUpdateMessage';
import CrmObjectLifecycleUpdate from '../../crm-object-lifecycle-update/records/CrmObjectLifecycleUpdate';
import InitialMessage from '../../initial-message/records/InitialMessage';
import TypingIndicatorMessage from '../../typing-indicator/records/TypingIndicatorMessage';
import InboxUpdateMessage from '../../inbox-update-message/records/InboxUpdateMessage';
import EmailCapturePromptMessage from '../../email-capture-prompt/records/EmailCapturePromptMessage';
import EmailCaptureResponseMessage from '../../email-capture-response/records/EmailCaptureResponseMessage';
import OfficeHoursMessage from '../../office-hours-message/records/OfficeHoursMessage';
import TypicalResponseTimeMessage from '../../typical-response-time/records/TypicalResponseTimeMessage';
import FilteredChangeMessage from '../../filtered-change-message/records/FilteredChangeMessage';
import ThreadStatusUpdateMessage from '../../thread-status-update/records/ThreadStatusUpdateMessage';
import AssignmentUpdateMessage from '../../assignment-update-message/records/AssignmentUpdateMessage';
import FeedbackSubmissionMessage from '../../feedback-submission/records/FeedbackSubmissionMessage';
import {
    getRecordName
} from '../../util/getRecordName';
import TranscriptSubmissionMessage from '../../transcript-submission/records/TranscriptSubmissionMessage';
import TicketCreationFailureMessage from '../../ticket-creation-failure/records/TicketCreationFailureMessage';
import CrmObjectWorkflowEmailSent from '../../crm-object-workflow-email-sent/records/CrmObjectWorkflowEmailSent';
import FeedbackSurveyMessage from '../../feedback-survey-message/records/FeedbackSurveyMessage';
import WorkflowGeneratedUserMessage from '../../workflow-generated-user-message/records/WorkflowGeneratedUserMessage';
import ThreadPausedOnGenericChannelMessage from '../../thread-paused-on-generic-channel-message/records/ThreadPausedOnGenericChannelMessage';
import CustomerAgentMaintenanceModeMessage from '../../customer-agent-maintenance-mode-message/records/CustomerAgentMaintenanceModeMessage';
import CustomerAgentAutomatedMessage from '../../customer-agent-automated-message/records/CustomerAgentAutomatedMessage';
import RejectedMessage from '../../message-rejected/records/RejectedMessage';
import PartialMessage from '../../partial-message/records/PartialMessage';
import invariant from 'react-utils/invariant';
import EngagementDetailsRecord from '../../engagement-details-message/records/EngagementDetailsRecord';
import HelpDeskCommentReplyMessage from '../../help-desk-comment-reply-message/records/HelpDeskCommentReplyMessage';
import InteractiveCardRequestMessage from '../../interactive-card-request-message/records/InteractiveCardRequestMessage';
import InteractiveCardResponseMessage from '../../interactive-card-response-message/records/InteractiveCardResponseMessage';
const supportedRecords = [CommonMessage, ContextUpdateMessage, CrmObjectLifecycleUpdate, CommentMessage, EngagementDetailsRecord, InitialMessage, TypingIndicatorMessage, InboxUpdateMessage, EmailCapturePromptMessage, EmailCaptureResponseMessage, OfficeHoursMessage, TypicalResponseTimeMessage, FilteredChangeMessage, ThreadStatusUpdateMessage, AssignmentUpdateMessage, FeedbackSubmissionMessage, TranscriptSubmissionMessage, TicketCreationFailureMessage, WorkflowGeneratedUserMessage, CrmObjectWorkflowEmailSent, FeedbackSurveyMessage, ThreadPausedOnGenericChannelMessage, CustomerAgentMaintenanceModeMessage, CustomerAgentAutomatedMessage, HelpDeskCommentReplyMessage, InteractiveCardRequestMessage, InteractiveCardResponseMessage, RejectedMessage, PartialMessage];
export const pubSubMessageRecordInvariant = message => invariant(supportedRecords.some(record => message instanceof record), `Message given is '${getRecordName(message)}', but expected one of ${supportedRecords.map(getRecordName)}`);