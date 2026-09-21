// @ts-ignore dependency missing types
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { WORKFLOW_GENERATED_USER_MESSAGE } from '../constants/messageTypes';
export const isWorkflowGeneratedUserMessage = message => getTopLevelType(message) === WORKFLOW_GENERATED_USER_MESSAGE;