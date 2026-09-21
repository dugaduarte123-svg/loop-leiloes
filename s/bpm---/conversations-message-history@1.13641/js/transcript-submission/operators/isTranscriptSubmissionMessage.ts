// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { CHAT_TRANSCRIPT_SENT } from '../constants/messageTypes';
// FIXME Replace with a union type for messages

export const isTranscriptSubmissionMessage = message => getTopLevelType(message) === CHAT_TRANSCRIPT_SENT;