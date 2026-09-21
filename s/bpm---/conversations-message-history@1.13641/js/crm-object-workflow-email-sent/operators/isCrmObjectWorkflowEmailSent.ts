// @ts-ignore commonMessageFormatGetters is not typed
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { CRM_OBJECT_WORKFLOW_EMAIL_SENT } from '../constants/messageTypes';
export const isCrmObjectWorkflowEmailSent = message => {
  return getTopLevelType(message) === CRM_OBJECT_WORKFLOW_EMAIL_SENT;
};