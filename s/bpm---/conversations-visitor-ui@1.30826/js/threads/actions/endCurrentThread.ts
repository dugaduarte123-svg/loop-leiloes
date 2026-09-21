import Raven from 'raven-js';
import { getSelectedThreadId } from '../../selected-thread/selectors/getSelectedThreadId';
import { getSessionId } from '../../selectors/widgetDataSelectors/getSessionId';
import { STUBBED_THREAD_ID } from '../constants/stubbedThreadId';
import { endVisitorThread } from '../clients/endVisitorThread';
export const endCurrentThread = () => (_dispatch, getState) => {
  const sessionId = getSessionId(getState());
  const threadId = getSelectedThreadId(getState());
  if (threadId === null || threadId === STUBBED_THREAD_ID) {
    return Promise.resolve();
  }
  return endVisitorThread({
    threadId,
    sessionId
  }).catch(err => {
    if (err) {
      Raven.captureException(err);
    }
  });
};