// @ts-ignore untyped-file
import { getId } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import ThreadHistory from 'conversations-message-history/thread-history/records/ThreadHistory';
// @ts-ignore untyped-file
import { handleActions } from 'flux-actions';
import { RESET_STUBBED_THREAD, STAGE_MESSAGE_ON_STUBBED_THREAD } from '../../stubbed-thread-history/constants/StubbedThreadHistoryActionTypes';
import { addMessageToThreadHistory } from '../../thread-histories/operators/addMessageToThreadHistory';
import { CREATE_NEW_THREAD } from '../constants/actionTypes';
import { getData, uninitialized, started, succeeded, failed } from '../../constants/asyncStatuses';
const initialState = uninitialized(new ThreadHistory());
export const stagedThread = handleActions({
  [STAGE_MESSAGE_ON_STUBBED_THREAD](state, action) {
    const {
      message,
      shouldRetainFailureState
    } = action.payload;
    const updatedData = addMessageToThreadHistory(getId(message), message, getData(state));
    if (shouldRetainFailureState) {
      return Object.assign({}, state, {
        data: updatedData
      });
    }
    return uninitialized(updatedData);
  },
  [RESET_STUBBED_THREAD](state, action) {
    const {
      payload = {}
    } = action;
    return payload.shouldRetainFailureState ? Object.assign({}, state, {
      data: new ThreadHistory()
    }) : initialState;
  },
  [CREATE_NEW_THREAD.STARTED]: state => started(getData(state)),
  [CREATE_NEW_THREAD.SUCCEEDED]: state => succeeded(getData(state)),
  [CREATE_NEW_THREAD.FAILED]: (state, action) => {
    const errorPayload = action.payload;
    return failed(getData(state), errorPayload);
  }
}, initialState);