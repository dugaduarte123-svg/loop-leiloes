import { createAction } from '@reduxjs/toolkit';
import { getThreadByThreadId } from '../../threads/selectors/getThreadByThreadId';
//@ts-ignore untyped-file
import { calculateUnseenThreadsCount } from '../../threads/selectors/calculateUnseenThreadsCount';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import { postUnreadConversationCountChangedEvent } from '../../threads/actions/postUnreadConversationCountChangedEvent';
import { getUnseenCount } from '../../threads/operators/threadGetters';
export const incrementUnseenCountAction = createAction(ActionTypes.INCREMENT_UNSEEN_COUNT, ({
  channel,
  threadId
}) => ({
  payload: {
    channel,
    threadId
  }
}));
export const incrementUnseenCount = ({
  channel,
  threadId
}) => (dispatch, getState) => {
  const thread = getThreadByThreadId(getState(), {
    threadId
  });
  const originalUnseenCountForThread = getUnseenCount(thread);
  dispatch(incrementUnseenCountAction({
    channel,
    threadId
  }));
  if (originalUnseenCountForThread === 0) {
    const newUnreadThreadsCount = calculateUnseenThreadsCount(getState());
    postUnreadConversationCountChangedEvent({
      unreadCount: newUnreadThreadsCount
    });
  }
};