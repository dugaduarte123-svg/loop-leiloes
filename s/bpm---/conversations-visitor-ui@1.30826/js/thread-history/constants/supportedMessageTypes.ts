import { DATE_MESSAGE } from 'conversations-message-history/dates/constants/messageTypes';
import { COMMON_MESSAGE } from 'conversations-message-history/common-message-format/constants/messageTypes';
import { EMAIL_CAPTURE_PROMPT } from 'conversations-message-history/email-capture-prompt/constants/messageTypes';
import { INITIAL_MESSAGE } from 'conversations-message-history/initial-message/constants/messageType';
import { OFFICE_HOURS } from 'conversations-message-history/office-hours-message/constants/messageTypes';
import { TYPICAL_RESPONSE_TIME } from 'conversations-message-history/typical-response-time/constants/messageTypes';
import { TYPING } from 'conversations-message-history/typing-indicator/constants/messageTypes';
import { FEEDBACK_SURVEY } from 'conversations-message-history/feedback-survey-message/constants/messageTypes';
import { ACTIVELY_PUBLISHING, FAILED_TO_PUBLISH } from 'conversations-message-history/unpublished-messages/constants/messageTypes';
import { PARTIAL_MESSAGE } from 'conversations-message-history/partial-message/constants/messageTypes';
import { CUSTOMER_AGENT_MAINTENANCE_MODE_MESSAGE } from 'conversations-message-history/customer-agent-maintenance-mode-message/constants/messageTypes';
import { CUSTOMER_AGENT_AUTOMATED_MESSAGE } from 'conversations-message-history/customer-agent-automated-message/constants/messageTypes';
import { CUSTOMER_AGENT_FEEDBACK_MESSAGE } from 'conversations-message-history/customer-agent-feedback-message/constants/messageTypes';
import { AVAILABILITY_AUTO_REPLY } from 'conversations-message-history/availability-auto-reply/constants/messageTypes';
export const supportedMessageTypes = {
  ACTIVELY_PUBLISHING,
  AVAILABILITY_AUTO_REPLY,
  COMMON_MESSAGE,
  PARTIAL_MESSAGE,
  DATE_MESSAGE,
  EMAIL_CAPTURE_PROMPT,
  FAILED_TO_PUBLISH,
  INITIAL_MESSAGE,
  OFFICE_HOURS,
  TYPICAL_RESPONSE_TIME,
  TYPING,
  FEEDBACK_SURVEY,
  CUSTOMER_AGENT_MAINTENANCE_MODE_MESSAGE,
  CUSTOMER_AGENT_AUTOMATED_MESSAGE,
  CUSTOMER_AGENT_FEEDBACK_MESSAGE
};