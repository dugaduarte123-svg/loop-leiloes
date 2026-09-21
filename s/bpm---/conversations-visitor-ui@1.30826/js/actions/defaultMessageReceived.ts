//@ts-ignore untyped-file
import { getSenderId } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import { AGENT, BOT } from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import { isFromBot, isFromVisitor
//@ts-ignore untyped-file
} from 'conversations-message-history/common-message-format/operators/senderTypeComparators';
//@ts-ignore untyped-file
import { getResponderByIdAndType } from '../responders/operators/getResponderByIdAndType';
import { getResponders } from '../responders/selectors/getResponders';
import { receivedIncomingMessage } from './ChatActions/receivedIncomingMessage';
export function defaultMessageReceived(message, channel, threadId, publishContext) {
  return (dispatch, getState) => {
    const responders = getResponders(getState());
    let responder;
    // Chat open in multiple windows
    const messageFromVisitor = isFromVisitor(message);
    if (!messageFromVisitor) {
      const senderId = getSenderId(message);
      const senderType = isFromBot(message) ? BOT : AGENT;
      responder = getResponderByIdAndType({
        responders,
        senderType,
        senderId
      });
    }
    dispatch(receivedIncomingMessage({
      message,
      channel,
      responder,
      shouldNotify: !messageFromVisitor && (!publishContext || !publishContext.playback),
      threadId
    }));
  };
}