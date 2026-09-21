import * as ActionTypes from '../../constants/VisitorActionTypes';
import { TOGGLE_INITIAL_MESSAGE_BUBBLE } from '../../initial-message-bubble/constants/initialMessageBubbleActionTypes';
import { createWidgetUiState } from '../../selectors/getWidgetUiState';
import { parseStringBoolean } from '../../utils/parseStringBoolean';
const {
  TOGGLE_OPEN,
  RECEIVED_WIDGET_SHELL_DATA,
  TRACK_USER_INTERACTION
} = ActionTypes;
const parseShellData = data => ({
  mobile: parseStringBoolean(`${data.mobile}`),
  open: parseStringBoolean(`${data.open}`),
  hideWelcomeMessage: parseStringBoolean(`${data.hideWelcomeMessage}`),
  domain: data.domain,
  startOpen: data.startOpen,
  url: data.url || '',
  userInteractedWithWidget: false,
  isEmbeddedInProduct: parseStringBoolean(`${data.inApp53}`),
  isIOSMobile: parseStringBoolean(`${data.isIOSMobile}`)
});
export default function widgetUi(state = createWidgetUiState(), action) {
  switch (action.type) {
    case TOGGLE_INITIAL_MESSAGE_BUBBLE:
      if (!action.payload.visible && action.payload.closedByUser) {
        return Object.assign({}, state, {
          startOpen: false,
          hideWelcomeMessage: true
        });
      }
      return state;
    case RECEIVED_WIDGET_SHELL_DATA:
      return Object.assign({}, state, parseShellData(action.payload));
    case TOGGLE_OPEN:
      if (!action.payload.isOpened && action.payload.isUser) {
        return Object.assign({}, state, {
          startOpen: false,
          hideWelcomeMessage: true,
          open: action.payload.isOpened
        });
      }
      return Object.assign({}, state, {
        open: action.payload.isOpened
      });
    case TRACK_USER_INTERACTION:
      return Object.assign({}, state, {
        userInteractedWithWidget: true
      });
    default:
      return state;
  }
}