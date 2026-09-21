// @ts-ignore dependency missing types
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { TICKET_CREATION_FAILURE } from '../constants/messageTypes';
export const isTicketCreationFailure = message => getTopLevelType(message) === TICKET_CREATION_FAILURE;