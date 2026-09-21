import { trackInteraction } from '../../usage-tracking/actions/trackInteraction';
import { clearSelectedThread } from '../../selected-thread/actions/clearSelectedThread';
import { updateView } from '../../current-view/actions/updateView';
import { THREAD_LIST } from 'conversations-visitor-experience-components/visitor-widget/constants/views';
import { trackUserInteraction } from '../../actions/trackUserInteraction';
import { EVENT_NAMES } from '../../usage-tracking/constants/eventNames';
export function navigateToThreadListIndependent() {
  return dispatch => {
    dispatch(trackUserInteraction());
    dispatch(clearSelectedThread());
    dispatch(updateView(THREAD_LIST));
    dispatch(trackInteraction(EVENT_NAMES.WIDGET_INTERACTION, {
      action: 'view thread list'
    }));
  };
}