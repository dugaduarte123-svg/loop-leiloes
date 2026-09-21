import { trackInteraction } from '../../usage-tracking/actions/trackInteraction';
import { loadStagedThread } from './loadStagedThread';
import { EVENT_NAMES } from '../../usage-tracking/constants/eventNames';
export function navigateToStagedThread() {
  return dispatch => {
    dispatch(loadStagedThread());
    dispatch(trackInteraction(EVENT_NAMES.WIDGET_INTERACTION, {
      action: 'create new thread'
    }));
  };
}