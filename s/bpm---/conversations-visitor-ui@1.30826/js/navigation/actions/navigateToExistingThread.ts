import { trackInteraction } from '../../usage-tracking/actions/trackInteraction';
import { loadExistingThread } from './loadExistingThread';
import { EVENT_NAMES } from '../../usage-tracking/constants/eventNames';
export function navigateToExistingThread({
  threadId
}) {
  return dispatch => {
    dispatch(loadExistingThread({
      threadId
    }));
    dispatch(trackInteraction(EVENT_NAMES.WIDGET_INTERACTION, {
      action: 'view thread'
    }));
  };
}