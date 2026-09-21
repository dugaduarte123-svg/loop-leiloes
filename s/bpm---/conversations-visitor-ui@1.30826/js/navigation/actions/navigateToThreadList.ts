import { getKnowledgeBaseEnabled } from '../../selectors/widgetDataSelectors/getKnowledgeBaseEnabled';
import { navigateToThreadListIndependent } from './navigateToThreadListIndependent';
import { navigateToThreadListKnowledgebase } from './navigateToThreadListKnowledgebase';
export function navigateToThreadList() {
  return (dispatch, getState) => {
    if (getKnowledgeBaseEnabled(getState())) {
      dispatch(navigateToThreadListKnowledgebase());
    } else {
      dispatch(navigateToThreadListIndependent());
    }
  };
}