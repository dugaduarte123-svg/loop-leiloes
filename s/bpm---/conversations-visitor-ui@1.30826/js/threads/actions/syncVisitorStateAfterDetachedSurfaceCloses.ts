import { loadExistingThread } from '../../navigation/actions/loadExistingThread';
import { updateSessionId } from '../../widget-data/actions/updateSessionId';
import { STUBBED_THREAD_ID } from '../constants/stubbedThreadId';
import { getThreads } from '../selectors/getThreads';
import { fetchVisitorThreads, navigateToMostRecentThread
// @ts-ignore untyped JS module
} from './ThreadActions';
export function syncVisitorStateAfterDetachedSurfaceCloses(sync) {
  return async (dispatch, getState) => {
    var _threads$has;
    if (sync !== null && sync !== void 0 && sync.sessionId) {
      dispatch(updateSessionId(sync.sessionId));
    }
    await dispatch(fetchVisitorThreads());
    const state = getState();
    const threadId = sync === null || sync === void 0 ? void 0 : sync.threadId;
    const threads = getThreads(state);
    if (threadId != null && threadId !== STUBBED_THREAD_ID && threads !== null && threads !== void 0 && (_threads$has = threads.has) !== null && _threads$has !== void 0 && _threads$has.call(threads, threadId)) {
      dispatch(loadExistingThread({
        threadId
      }));
      return;
    }
    dispatch(navigateToMostRecentThread());
  };
}