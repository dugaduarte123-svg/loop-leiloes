import { buildCommentMessage } from '../../comment-message/operators/buildCommentMessage';
import { buildCommonMessage } from '../../common-message-format/operators/buildCommonMessage';
//@ts-ignore this file is untyped
import { isCommonMessageFormat } from '../../common-message-format/operators/cmfComparators';
//@ts-ignore this file is untyped
import { isContextUpdateMessage } from '../../context-update/operators/isContextUpdateMessage';
//@ts-ignore this file is untyped
import ContextUpdateMessage from '../../context-update/records/ContextUpdateMessage';
//@ts-ignore this file is untyped
import { isCrmObjectLifecycleUpdate } from '../../crm-object-lifecycle-update/operators/isCrmObjectLifecycleUpdate';
//@ts-ignore this file is untyped
import CrmObjectLifecycleUpdate from '../../crm-object-lifecycle-update/records/CrmObjectLifecycleUpdate';
//@ts-ignore this file is untyped
import { buildInitialMessage } from '../../initial-message/operators/buildInitialMessage';
//@ts-ignore this file is untyped
import { isInitialMessage } from '../../initial-message/operators/isInitialMessage';
//@ts-ignore this file is untyped
import { isMessagesUpdateMessage } from '../../message-updates/operators/isMessagesUpdateMessage';
import MessagesUpdates from '../../message-updates/records/MessagesUpdates';
import TypingIndicatorMessage from '../../typing-indicator/records/TypingIndicatorMessage';
import ReadThreadMessage from '../../read-thread-message/records/ReadThreadMessage';
//@ts-ignore this file is untyped
import InboxUpdateMessage from '../../inbox-update-message/records/InboxUpdateMessage';
//@ts-ignore this file is untyped
import ContactAssociationMessage from '../../contact-association-message/records/ContactAssociationMessage';
import { isTypingMessage } from '../../typing-indicator/operators/isTypingMessage';
//@ts-ignore this file is untyped
import { isContactAssociationMessage } from '../../contact-association-message/operators/isContactAssociationMessage';
//@ts-ignore this file is untyped
import { isInboxUpdateMessage } from '../../inbox-update-message/operators/isInboxUpdateMessage';
import { isReadThreadMessage } from '../../read-thread-message/operators/isReadThreadMessage';
//@ts-ignore this file is untyped
import { isThreadComment } from '../../comment-message/operators/cmComparators';
import { isEmailCapturePromptMessage } from '../../email-capture-prompt/operators/isEmailCapturePromptMessage';
import { isEmailCaptureResponseMessage } from '../../email-capture-response/operators/isEmailCaptureResponseMessage';
//@ts-ignore this file is untyped
import { isOfficeHoursMessage } from '../../office-hours-message/operators/isOfficeHoursMessage';
//@ts-ignore this file is untyped
import { isFilteredChangeMessage } from '../../filtered-change-message/operators/isFilteredChangeMessage';
//@ts-ignore this file is untyped
import { isThreadStatusUpdateMessage } from '../../thread-status-update/operators/isThreadStatusUpdateMessage';
//@ts-ignore this file is untyped
import OfficeHoursMessage from '../../office-hours-message/records/OfficeHoursMessage';
import { isTypicalResponseTimeMessage } from '../../typical-response-time/operators/isTypicalResponseTimeMessage';
import { isAvailabilityAutoReplyMessage } from '../../availability-auto-reply/operators/isAvailabilityAutoReplyMessage';
import AvailabilityAutoReplyMessage from '../../availability-auto-reply/records/AvailabilityAutoReplyMessage';
import EmailCapturePromptMessage from '../../email-capture-prompt/records/EmailCapturePromptMessage';
import EmailCaptureResponseMessage from '../../email-capture-response/records/EmailCaptureResponseMessage';
import AgentAvailabilityMessage from '../../agent-availability-message/records/AgentAvailabilityMessage';
import { isAgentAvailabilityMessage } from '../../agent-availability-message/operators/isAgentAvailabilityMessage';
import TypicalResponseTimeMessage from '../../typical-response-time/records/TypicalResponseTimeMessage';
//@ts-ignore this file is untyped
import FilteredChangeMessage from '../../filtered-change-message/records/FilteredChangeMessage';
//@ts-ignore this file is untyped
import ThreadStatusUpdateMessage from '../../thread-status-update/records/ThreadStatusUpdateMessage';
//@ts-ignore this file is untyped
import { isAssignmentUpdateMessage } from '../../assignment-update-message/operators/isAssignmentUpdateMessage';
//@ts-ignore this file is untyped
import AssignmentUpdateMessage from '../../assignment-update-message/records/AssignmentUpdateMessage';
//@ts-ignore this file is untyped
import { isFeedbackSurveyMessage } from '../../feedback-survey-message/operators/isFeedbackSurveyMessage';
import { buildFeedbackSurveyMessage } from '../../feedback-survey-message/operators/buildFeedbackSurveyMessage';
//@ts-ignore this file is untyped
import { isFeedbackSubmissionMessage } from '../../feedback-submission/operators/isFeedbackSubmissionMessage';
import { isTranscriptSubmissionMessage } from '../../transcript-submission/operators/isTranscriptSubmissionMessage';
import TranscriptSubmissionMessage from '../../transcript-submission/records/TranscriptSubmissionMessage';
import { isTicketCreationFailure } from '../../ticket-creation-failure/operators/isTicketCreationFailure';
import TicketCreationFailureMessage from '../../ticket-creation-failure/records/TicketCreationFailureMessage';
import { buildFeedbackSubmissionMessage } from '../../feedback-submission/operators/buildFeedbackSubmissionMessage';
import { isWorkflowGeneratedUserMessage } from '../../workflow-generated-user-message/operators/isWorkflowGeneratedUserMessage';
import { buildWorkflowGeneratedUserMessage } from '../../workflow-generated-user-message/operators/buildWorkflowGeneratedUserMessage';
import { isBatchSmsGeneratedUserMessage } from '../../batch-sms-generated-user-message/operators/isBatchSmsGeneratedUserMessage';
import BatchSmsGeneratedUserMessage from '../../batch-sms-generated-user-message/records/BatchSmsGeneratedUserMessage';
import { isBatchWhatsAppGeneratedUserMessage } from '../../batch-whatsapp-generated-user-message/operators/isBatchWhatsAppGeneratedUserMessage';
import BatchWhatsAppGeneratedUserMessage from '../../batch-whatsapp-generated-user-message/records/BatchWhatsAppGeneratedUserMessage';
import { isCrmObjectWorkflowEmailSent } from '../../crm-object-workflow-email-sent/operators/isCrmObjectWorkflowEmailSent';
//@ts-ignore this file is untyped
import CrmObjectWorkflowEmailSent from '../../crm-object-workflow-email-sent/records/CrmObjectWorkflowEmailSent';
import update from 'transmute/update';
import { isPartialMessage } from '../../partial-message/operators/isPartialMessage';
import { buildPartialMessage } from '../../partial-message/operators/buildPartialMessage';
import { isEngagementDetailsMessage } from '../../engagement-details-message/operators/isEngagementDetailsMessage';
import { buildEngagementDetailsMessage } from '../../engagement-details-message/operators/buildEngagementDetailsMessage';
import { isHelpdeskTicketSplitUpdateMessage } from '../../helpdesk-ticket-split-update-message/operators/isHelpdeskTicketSplitUpdateMessage';
import HelpdeskTicketSplitUpdateMessage from '../../helpdesk-ticket-split-update-message/records/HelpdeskTicketSplitUpdateMessage';
import { isThreadPausedOnGenericChannelMessage } from '../../thread-paused-on-generic-channel-message/operators/isThreadPausedOnGenericChannelMessage';
import { buildThreadPausedOnGenericChannelMessage } from '../../thread-paused-on-generic-channel-message/operators/buildThreadPausedOnGenericChannelMessage';
import { isCustomerAgentActionExecutionMessage } from '../../customer-agent-action-execution-message/operators/isCustomerAgentActionExecutionMessage';
import CustomerAgentActionExecutionMessage from '../../customer-agent-action-execution-message/records/CustomerAgentActionExecutionMessage';
import { isCustomerAgentMaintenanceModeMessage } from '../../customer-agent-maintenance-mode-message/operators/isCustomerAgentMaintenanceModeMessage';
import CustomerAgentMaintenanceModeMessage from '../../customer-agent-maintenance-mode-message/records/CustomerAgentMaintenanceModeMessage';
import { isCustomerAgentAutomatedMessage } from '../../customer-agent-automated-message/operators/isCustomerAgentAutomatedMessage';
import CustomerAgentAutomatedMessage from '../../customer-agent-automated-message/records/CustomerAgentAutomatedMessage';
import { isSmsConsentAutomatedMessage } from '../../sms-consent-automated-message/operators/isSmsConsentAutomatedMessage';
import SmsConsentAutomatedMessage from '../../sms-consent-automated-message/records/SmsConsentAutomatedMessage';
import { isCustomerAgentFeedbackMessage } from '../../customer-agent-feedback-message/operators/isCustomerAgentFeedbackMessage';
import CustomerAgentFeedbackMessage from '../../customer-agent-feedback-message/records/CustomerAgentFeedbackMessage';
import { isRejectedMessage } from '../../message-rejected/operators/isRejectedMessage';
import RejectedMessage from '../../message-rejected/records/RejectedMessage';
import { isInteractiveCardRequestMessage } from '../../interactive-card-request-message/operators/isInteractiveCardRequestMessage';
import InteractiveCardRequestMessage from '../../interactive-card-request-message/records/InteractiveCardRequestMessage';
import { isInteractiveCardResponseMessage } from '../../interactive-card-response-message/operators/isInteractiveCardResponseMessage';
import InteractiveCardResponseMessage from '../../interactive-card-response-message/records/InteractiveCardResponseMessage';
import { isThreadReopenSplitMessage } from '../../thread-reopen-split-message/operators/isThreadReopenSplitMessage';
import ThreadReopenSplitMessage from '../../thread-reopen-split-message/records/ThreadReopenSplitMessage';
import { ACTIVITY_TIMELINE_EVENT } from '../../activity-timeline-event/constants/messageTypes';
import ActivityTimelineEventRecord from '../../activity-timeline-event/records/ActivityTimelineEventRecord';
import toJS from 'immutable-less/transmute/toJS';
import HelpDeskCommentReplyMessage from '../../help-desk-comment-reply-message/records/HelpDeskCommentReplyMessage';
import { isHelpDeskCommentReplyMessage } from '../../help-desk-comment-reply-message/operators/isHelpDeskCommentReplyMessage';
function updateRecipients(recipients) {
  return recipients && recipients.length ? recipients.map(recipient => Object.assign({}, recipient, {
    deliveryIdentifier: recipient.singleDeliveryIdentifier
  })) : recipients;
}
export function serialize(message) {
  const messageJS = toJS(message);
  return update('recipients', updateRecipients, messageJS);
}
export function deserialize({
  json
}) {
  if (isMessagesUpdateMessage(json)) {
    return new MessagesUpdates(json);
  }
  if (isThreadComment(json)) {
    return buildCommentMessage(json);
  }
  if (isEngagementDetailsMessage(json)) {
    return buildEngagementDetailsMessage(json);
  }
  if (isCommonMessageFormat(json)) {
    return buildCommonMessage(json);
  }
  if (isPartialMessage(json)) {
    return buildPartialMessage(json);
  }
  if (isInitialMessage(json)) {
    return buildInitialMessage(json);
  }
  if (isCrmObjectLifecycleUpdate(json)) {
    return new CrmObjectLifecycleUpdate(json);
  }
  if (isCrmObjectWorkflowEmailSent(json)) {
    return new CrmObjectWorkflowEmailSent(json);
  }
  if (isContextUpdateMessage(json)) {
    return new ContextUpdateMessage(json);
  }
  if (isTypingMessage(json)) {
    return new TypingIndicatorMessage(json);
  }
  if (isContactAssociationMessage(json)) {
    return new ContactAssociationMessage(json);
  }
  if (isEmailCaptureResponseMessage(json)) {
    return new EmailCaptureResponseMessage(json);
  }
  if (isEmailCapturePromptMessage(json)) {
    return new EmailCapturePromptMessage(json);
  }
  if (isOfficeHoursMessage(json)) {
    return new OfficeHoursMessage(json);
  }
  if (isTypicalResponseTimeMessage(json)) {
    return new TypicalResponseTimeMessage(json);
  }
  if (isAvailabilityAutoReplyMessage(json)) {
    return new AvailabilityAutoReplyMessage(json);
  }
  if (isFilteredChangeMessage(json)) {
    return new FilteredChangeMessage(json);
  }
  if (isThreadStatusUpdateMessage(json)) {
    return new ThreadStatusUpdateMessage(json);
  }
  if (isReadThreadMessage(json)) {
    return new ReadThreadMessage(json);
  }
  if (isInboxUpdateMessage(json)) {
    return new InboxUpdateMessage(json);
  }
  if (isAgentAvailabilityMessage(json)) {
    return new AgentAvailabilityMessage(json);
  }
  if (isAssignmentUpdateMessage(json)) {
    return new AssignmentUpdateMessage(json);
  }
  if (isFeedbackSurveyMessage(json)) {
    return buildFeedbackSurveyMessage(json);
  }
  if (isFeedbackSubmissionMessage(json)) {
    return buildFeedbackSubmissionMessage(json);
  }
  if (isTranscriptSubmissionMessage(json)) {
    return new TranscriptSubmissionMessage(json);
  }
  if (isTicketCreationFailure(json)) {
    return new TicketCreationFailureMessage(json);
  }
  if (isWorkflowGeneratedUserMessage(json)) {
    return buildWorkflowGeneratedUserMessage(json);
  }
  if (isBatchSmsGeneratedUserMessage(json)) {
    return new BatchSmsGeneratedUserMessage(json);
  }
  if (isBatchWhatsAppGeneratedUserMessage(json)) {
    return new BatchWhatsAppGeneratedUserMessage(json);
  }
  if (isHelpdeskTicketSplitUpdateMessage(json)) {
    return new HelpdeskTicketSplitUpdateMessage(json);
  }
  if (isHelpDeskCommentReplyMessage(json)) {
    return new HelpDeskCommentReplyMessage(json);
  }
  if (isCustomerAgentActionExecutionMessage(json)) {
    return new CustomerAgentActionExecutionMessage(json);
  }
  if (isThreadPausedOnGenericChannelMessage(json)) {
    return buildThreadPausedOnGenericChannelMessage(json);
  }
  if (isCustomerAgentAutomatedMessage(json)) {
    return new CustomerAgentAutomatedMessage(json);
  }
  if (isSmsConsentAutomatedMessage(json)) {
    return new SmsConsentAutomatedMessage(json);
  }
  if (isCustomerAgentMaintenanceModeMessage(json)) {
    return new CustomerAgentMaintenanceModeMessage(json);
  }
  if (isCustomerAgentFeedbackMessage(json)) {
    return new CustomerAgentFeedbackMessage(json);
  }
  if (isRejectedMessage(json)) {
    return new RejectedMessage(json);
  }
  if (isInteractiveCardRequestMessage(json)) {
    return new InteractiveCardRequestMessage(json);
  }
  if (isInteractiveCardResponseMessage(json)) {
    return new InteractiveCardResponseMessage(json);
  }
  if (isThreadReopenSplitMessage(json)) {
    return new ThreadReopenSplitMessage(json);
  }
  if ((json === null || json === void 0 ? void 0 : json['@type']) === ACTIVITY_TIMELINE_EVENT) {
    return new ActivityTimelineEventRecord(json);
  }
  return json;
}