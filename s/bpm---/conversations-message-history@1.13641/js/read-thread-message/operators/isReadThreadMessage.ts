// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { READ_THREAD } from '../constants/messageTypes';
// FIXME Replace with a union type for messages

export const isReadThreadMessage = message => getTopLevelType(message) === READ_THREAD;