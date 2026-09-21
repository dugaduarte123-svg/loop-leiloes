import { trackInteraction } from '../../usage-tracking/actions/trackInteraction';
import { EVENT_NAMES } from '../../usage-tracking/constants/eventNames';
import { clearSelectedThread } from '../../selected-thread/actions/clearSelectedThread';
import { updateView } from '../../current-view/actions/updateView';
import { KNOWLEDGE_BASE, THREAD_LIST, CATEGORY_VIEW } from 'conversations-visitor-experience-components/visitor-widget/constants/views';
import { getCurrentView } from '../../current-view/selectors/getCurrentView';
import { getIsOpen } from '../../selectors/getIsOpen';
export function navigateToThreadListKnowledgebase() {
  return (dispatch, getState) => {
    const currentView = getCurrentView(getState());
    const isWidgetOpen = getIsOpen(getState());
    dispatch(clearSelectedThread());
    if (currentView === CATEGORY_VIEW) {
      dispatch(updateView(KNOWLEDGE_BASE));
    } else {
      //set default view to chat for new kb
      dispatch(updateView(THREAD_LIST));
    }
    if (isWidgetOpen) {
      dispatch(trackInteraction(EVENT_NAMES.WIDGET_INTERACTION, {
        action: 'view thread list'
      }));
    }
  };
}