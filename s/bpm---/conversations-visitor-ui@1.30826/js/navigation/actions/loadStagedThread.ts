import { STUBBED_THREAD_ID } from '../../threads/constants/stubbedThreadId';
import { selectThread } from '../../selected-thread/actions/selectThread';
import { resetStubbedThread } from '../../stubbed-thread-history/actions/resetStubbedThread';
import { updateView } from '../../current-view/actions/updateView';
import { THREAD_VIEW } from 'conversations-visitor-experience-components/visitor-widget/constants/views';
// @ts-ignore Untyped
import { stageInitialMessage } from '../../actions/PublishActions/stageInitialMessage';
export function loadStagedThread({
  view = THREAD_VIEW
} = {}) {
  return dispatch => {
    dispatch(selectThread(STUBBED_THREAD_ID));
    dispatch(resetStubbedThread());
    dispatch(updateView(view));
    dispatch(stageInitialMessage());
  };
}