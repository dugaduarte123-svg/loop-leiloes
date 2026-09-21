import { toggleInitialMessageBubble } from './toggleInitialMessageBubble';
import { trackUserInteraction } from '../../actions/trackUserInteraction';
import { handleClosedWelcomeMessage } from '../../post-message/handleClosedWelcomeMessage';
export const closeInitialMessageBubble = () => dispatch => {
  handleClosedWelcomeMessage();
  dispatch(toggleInitialMessageBubble(false, true));
  dispatch(trackUserInteraction());
};