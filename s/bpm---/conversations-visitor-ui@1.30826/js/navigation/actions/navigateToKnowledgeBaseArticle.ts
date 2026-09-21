import { updateView } from '../../current-view/actions/updateView';
import { getCurrentView } from '../../current-view/selectors/getCurrentView';
import { KNOWLEDGE_BASE_ARTICLE } from 'conversations-visitor-experience-components/visitor-widget/constants/views';
import { getShouldViewKBArticleExpanded } from '../../kb-article/kbArticleSelectors';
import { setKBArticle, setOriginViewContext } from '../../kb-article/kbArticleSlice';
import { trackInteraction } from '../../usage-tracking/actions/trackInteraction';
import { EVENT_NAMES } from '../../usage-tracking/constants/eventNames';
import { setWidgetSize } from '../../widget-size/widgetSizeSlice';
import { getIsUngatedForInAppHelp } from '../../widget-data/selectors/widgetDataSelectors';
export function navigateToKnowledgeBaseArticle(articleData, browserWindowHeight, additionalContext) {
  return (dispatch, getState) => {
    const shouldViewExpanded = getShouldViewKBArticleExpanded(getState());
    const isUngatedForInAppHelp = getIsUngatedForInAppHelp(getState());
    const currentView = getCurrentView(getState());
    const originViewContext = Object.assign({
      view: currentView
    }, additionalContext);
    dispatch(setKBArticle(articleData));
    dispatch(setOriginViewContext(originViewContext));
    if (shouldViewExpanded && !isUngatedForInAppHelp) {
      dispatch(setWidgetSize({
        width: 640,
        height: browserWindowHeight
      }));
    }
    dispatch(updateView(KNOWLEDGE_BASE_ARTICLE));
    dispatch(trackInteraction(EVENT_NAMES.WIDGET_INTERACTION, {
      action: 'view KB article in widget'
    }));
  };
}