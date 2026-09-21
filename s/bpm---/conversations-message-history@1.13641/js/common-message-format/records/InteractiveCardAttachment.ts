import { Record } from 'immutable';
import { INTERACTIVE_CARD } from '../constants/attachmentTypes';
const InteractiveCardAttachment = Record({
  '@type': INTERACTIVE_CARD,
  cardId: null,
  cardInstanceId: null
}, 'InteractiveCardAttachment');
export default InteractiveCardAttachment;