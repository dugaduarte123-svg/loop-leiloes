import { defaultMessageReceived } from '../../actions/defaultMessageReceived';
//@ts-ignore untyped-file
import { removeMessageInConversation } from '../../thread-histories/actions/removeMessageInConversation';
import { isRescindPartialMessage } from 'conversations-message-history/partial-message/operators/isRescindPartialMessage';
import { getData } from '../../constants/asyncStatuses';
import { getThreadHistories } from '../../thread-histories/selectors/getThreadHistories';
//@ts-ignore untyped-file
import { isCommonMessageFormat } from 'conversations-message-history/common-message-format/operators/cmfComparators';
import { getCompletedMessageId, getPartialOrdinal, getCompletedMessageTimestamp } from 'conversations-message-history/partial-message/operators/partialMessageGetters';
import { getTimestamp
//@ts-ignore untyped-file
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import { MESSAGE_RESULTS } from 'conversations-message-history/thread-history/constants/keyPaths';
export const partialMessageReceived = ({
  message,
  channel,
  threadId,
  publishContext
}) => (dispatch, getState) => {
  var _getThreadHistories;
  const currentState = getState();
  const entry = (_getThreadHistories = getThreadHistories(currentState)) === null || _getThreadHistories === void 0 ? void 0 : _getThreadHistories.get(threadId);
  const historyData = getData(entry);
  const existingMessage = historyData === null || historyData === void 0 ? void 0 : historyData.getIn([...MESSAGE_RESULTS, message.get('completedMessageId')]);
  if (isRescindPartialMessage(message)) {
    var _getPartialOrdinal, _getPartialOrdinal2, _getTimestamp, _getTimestamp2;
    // Corrective action: never render. Remove the streaming partial bubble if present.
    // Leave already-completed Common Messages untouched — a late partial must not
    // delete a persisted real message. Ignore stale rescinds that arrive after a
    // newer partial has already replaced the one being rescinded (same
    // ordinal/timestamp freshness check as the REPLACE path below).
    if (existingMessage && !isCommonMessageFormat(existingMessage) && ((_getPartialOrdinal = getPartialOrdinal(existingMessage)) !== null && _getPartialOrdinal !== void 0 ? _getPartialOrdinal : 0) <= ((_getPartialOrdinal2 = getPartialOrdinal(message)) !== null && _getPartialOrdinal2 !== void 0 ? _getPartialOrdinal2 : 0) && ((_getTimestamp = getTimestamp(existingMessage)) !== null && _getTimestamp !== void 0 ? _getTimestamp : 0) <= ((_getTimestamp2 = getTimestamp(message)) !== null && _getTimestamp2 !== void 0 ? _getTimestamp2 : 0)) {
      dispatch(removeMessageInConversation({
        message: existingMessage,
        threadId
      }));
    }
    return;
  }
  if (existingMessage) {
    var _getPartialOrdinal3, _getPartialOrdinal4, _getTimestamp3, _getTimestamp4;
    if (isCommonMessageFormat(existingMessage)) {
      // Don't overwrite common messages with partial messages
      return;
    }
    if (((_getPartialOrdinal3 = getPartialOrdinal(existingMessage)) !== null && _getPartialOrdinal3 !== void 0 ? _getPartialOrdinal3 : 0) > ((_getPartialOrdinal4 = getPartialOrdinal(message)) !== null && _getPartialOrdinal4 !== void 0 ? _getPartialOrdinal4 : 0) || ((_getTimestamp3 = getTimestamp(existingMessage)) !== null && _getTimestamp3 !== void 0 ? _getTimestamp3 : 0) > ((_getTimestamp4 = getTimestamp(message)) !== null && _getTimestamp4 !== void 0 ? _getTimestamp4 : 0)) {
      return;
    }
  }
  const stubMessage = message.set('id', getCompletedMessageId(message)).set('timestamp', getCompletedMessageTimestamp(message));
  dispatch(defaultMessageReceived(stubMessage, channel, threadId, publishContext));
};