import { trackInteraction } from '../../usage-tracking/actions/trackInteraction';
import { trackMessageSentMetric } from '../../usage-tracking/utils/trackMetric';
import { EVENT_NAMES } from '../../usage-tracking/constants/eventNames';
export const trackSendMessage = ({
  threadId
}) => dispatch => {
  const eventProps = {};
  if (typeof threadId === 'number') {
    eventProps.threadId = threadId;
  }
  trackMessageSentMetric();
  dispatch(trackInteraction(EVENT_NAMES.SEND_MESSAGE, eventProps));
};