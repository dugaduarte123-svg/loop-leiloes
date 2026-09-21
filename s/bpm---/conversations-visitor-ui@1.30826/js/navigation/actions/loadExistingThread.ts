import { selectThread } from '../../selected-thread/actions/selectThread';
import { updateView } from '../../current-view/actions/updateView';
import { THREAD_VIEW } from 'conversations-visitor-experience-components/visitor-widget/constants/views';
export function loadExistingThread({
  threadId
}) {
  return dispatch => {
    dispatch(selectThread(threadId));
    dispatch(updateView(THREAD_VIEW));
  };
}