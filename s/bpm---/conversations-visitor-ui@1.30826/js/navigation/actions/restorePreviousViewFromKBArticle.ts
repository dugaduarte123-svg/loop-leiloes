import { updateView } from '../../current-view/actions/updateView';
import { THREAD_VIEW } from 'conversations-visitor-experience-components/visitor-widget/constants/views';
import { getOriginViewContext } from '../../kb-article/kbArticleSelectors';
import { selectThread } from '../../selected-thread/actions/selectThread';
import { setStandardWidgetSize } from '../../widget-size/widgetSizeSlice';
// @ts-ignore untyped module
import { getCurrentThreadId } from '../../thread-history/selectors/getCurrentThreadId';
import { getUseSpotlightLauncher } from '../../widget-data/selectors/widgetDataSelectors';
export function restorePreviousViewFromKBArticle() {
  return (dispatch, getState) => {
    const state = getState();
    const {
      view: originView
    } = getOriginViewContext(state);
    const isSpotlight = getUseSpotlightLauncher(state);
    if (!isSpotlight) {
      dispatch(setStandardWidgetSize());
    }
    if (originView === THREAD_VIEW) {
      dispatch(selectThread(getCurrentThreadId(state)));
    }
    dispatch(updateView(originView));
  };
}