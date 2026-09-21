import { HELP_DESK_COMMENT_REPLY_SYSTEM_MESSAGE } from '../constants/messageTypes';
import { getType } from './helpDeskCommentReplyMessageGetters';
export const isHelpDeskCommentReplyMessage = message => {
  return getType(message) === HELP_DESK_COMMENT_REPLY_SYSTEM_MESSAGE;
};