import { trackInteraction } from '../../usage-tracking/actions/trackInteraction';
import { setConsentToProcessStatus } from '../reducers/gdpr';
import { SHOULD_NOT_ASK_FOR_CONSENT } from 'conversations-internal-schema/widget-data/records/GDPRConsentToProcessStatusTypes';
import { EVENT_NAMES } from '../../usage-tracking/constants/eventNames';
export function closeConsentToProcess() {
  return dispatch => {
    dispatch(trackInteraction(EVENT_NAMES.WIDGET_INTERACTION, {
      action: 'close consent to process'
    }));
    dispatch(setConsentToProcessStatus(SHOULD_NOT_ASK_FOR_CONSENT));
  };
}