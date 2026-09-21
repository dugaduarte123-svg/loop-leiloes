import { navigateToKnowledgeBaseArticle } from '../../navigation/actions/navigateToKnowledgeBaseArticle';
import { trackInteraction } from '../../usage-tracking/actions/trackInteraction';
import { EVENT_NAMES } from '../../usage-tracking/constants/eventNames';
export const handleArticleClick = (articleId, href, browserWindowHeight, searchTerm) => dispatch => {
  dispatch(trackInteraction(EVENT_NAMES.WIDGET_INTERACTION, {
    action: 'clicked-kb-article'
  }));
  dispatch(navigateToKnowledgeBaseArticle({
    deepLink: href,
    hubSpotContentId: `${articleId}`,
    hubSpotContentTextFragment: ''
  }, browserWindowHeight, {
    searchTerm
  }));
};