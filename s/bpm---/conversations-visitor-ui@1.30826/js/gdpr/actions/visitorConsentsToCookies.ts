import { handleStoreMessagesCookie } from '../../post-message/handleStoreMessagesCookie';
import { getMessagesUtk } from '../../query-params/getMessagesUtk';
import { trackInteraction } from '../../usage-tracking/actions/trackInteraction';
import { EVENT_NAMES } from '../../usage-tracking/constants/eventNames';
export function consentToCookies() {
  return dispatch => {
    handleStoreMessagesCookie(getMessagesUtk());
    dispatch(trackInteraction(EVENT_NAMES.WIDGET_INTERACTION, {
      action: 'clicked consent to cookies button'
    }));
  };
}