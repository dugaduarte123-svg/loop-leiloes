import { getShouldViewKBArticleExpanded } from '../../kb-article/kbArticleSelectors';
import { setViewExpanded } from '../../kb-article/kbArticleSlice';
import { setWidgetSize, setStandardWidgetSize } from '../../widget-size/widgetSizeSlice';
export function toggleWidgetSizeForKBArticle(browserWindowHeight) {
  return (dispatch, getState) => {
    const viewExpanded = getShouldViewKBArticleExpanded(getState());
    if (viewExpanded) {
      dispatch(setStandardWidgetSize());
    } else {
      dispatch(setWidgetSize({
        width: 640,
        height: browserWindowHeight
      }));
    }
    dispatch(setViewExpanded(!viewExpanded));
  };
}