import { Map as ImmutableMap } from 'immutable';
// @ts-ignore untyped module
import { getId } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import ActivelyPublishing from 'conversations-message-history/unpublished-messages/records/ActivelyPublishing';
import FailedToPublish from 'conversations-message-history/unpublished-messages/records/FailedToPublish';
// @ts-ignore untyped module
import { handleActions } from 'flux-actions';
import { started, failed } from '../../constants/asyncStatuses';
import { REMOVE_MESSAGE_IN_CONVERSATION } from '../../thread-histories/constants/ActionTypes';
import { PUBLISH_MESSAGE } from '../constants/asyncActionTypes';
const initialState = ImmutableMap();
export default handleActions({
  [PUBLISH_MESSAGE.STARTED](state, action) {
    const {
      messageKey,
      threadId,
      channel,
      message
    } = action.payload;
    return state.set(messageKey, started(ActivelyPublishing({
      threadId,
      channel,
      message
    })));
  },
  [PUBLISH_MESSAGE.SUCCEEDED](state, action) {
    const {
      messageKey
    } = action.payload;
    return state.delete(messageKey);
  },
  [PUBLISH_MESSAGE.FAILED](state, action) {
    const {
      messageKey,
      threadId,
      channel,
      message
    } = action.payload;
    return state.set(messageKey, failed(FailedToPublish({
      threadId,
      channel,
      message
    })));
  },
  [REMOVE_MESSAGE_IN_CONVERSATION](state, action) {
    const {
      message
    } = action.payload;
    const messageKey = getId(message);
    return state.delete(messageKey);
  }
}, initialState);