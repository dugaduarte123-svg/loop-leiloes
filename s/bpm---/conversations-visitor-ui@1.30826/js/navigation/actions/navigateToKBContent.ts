import { updateView } from '../../current-view/actions/updateView';
import { KNOWLEDGE_BASE, CATEGORY, CATEGORY_VIEW } from 'conversations-visitor-experience-components/visitor-widget/constants/views';
import { setSelectedCategory } from '../../knowledge-base/reducers/kbLibrarySlice';
export function navigateToKBContent(target) {
  return dispatch => {
    switch (target.type) {
      case KNOWLEDGE_BASE:
        dispatch(updateView(KNOWLEDGE_BASE));
        break;
      case CATEGORY:
        dispatch(setSelectedCategory({
          id: Number(target.categoryId),
          name: '',
          openedFromSdk: true
        }));
        dispatch(updateView(CATEGORY_VIEW));
        break;
      default:
        dispatch(updateView(KNOWLEDGE_BASE));
    }
  };
}