// @ts-ignore dependency missing types
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { HELP_DESK_TICKET_SPLIT_UPDATE_MESSAGE } from '../constants/messageTypes';
export const isHelpdeskTicketSplitUpdateMessage = message => getTopLevelType(message) === HELP_DESK_TICKET_SPLIT_UPDATE_MESSAGE;