import { createSlice } from '@reduxjs/toolkit';
import { INCREMENT_UNSEEN_COUNT, CLEAR_UNSEEN_COUNT_FOR_CHANNEL } from '../../../constants/VisitorActionTypes';
import { receivedIncomingMessageAction } from '../../../actions/ChatActions/receivedIncomingMessage';
import { PUBLISH_MESSAGE } from '../../../pubsub/constants/asyncActionTypes';
import { CREATE_NEW_THREAD } from '../../../thread-create/constants/actionTypes';
import { PARTIAL_MESSAGE } from 'conversations-message-history/partial-message/constants/messageTypes';
import { getRichText, getPlainText
// @ts-ignore untyped-file
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import { isCommonMessageFormat
// @ts-ignore untyped-file
} from 'conversations-message-history/common-message-format/operators/cmfComparators';
import { getAttachmentWithType
// @ts-ignore untyped-file
} from 'conversations-message-history/common-message-format/operators/commonMessageGetters';
// @ts-ignore untyped-file
import { FILES } from 'conversations-message-history/common-message-format/constants/attachmentTypes';
import { toggleOpenAction } from '../../../actions/WidgetActions';
const initialState = {
  dismissed: true,
  count: 0,
  previewText: null,
  hasAttachment: false
};
const resetToInitial = state => {
  state.dismissed = true;
  state.count = 0;
  state.previewText = null;
  state.hasAttachment = false;
};
const newMessagePreviewPopupSlice = createSlice({
  name: 'newMessagePreviewPopup',
  initialState,
  reducers: {
    dismissNewMessagePreviewPopup: resetToInitial
  },
  extraReducers: builder => {
    builder.addCase(receivedIncomingMessageAction, (state, action) => {
      var _action$payload$messa;
      // Only CMF messages (COMMON_MESSAGE, INITIAL_MESSAGE, etc.) carry
      // displayable text. System messages (THREAD_STATUS_UPDATE,
      // ASSIGNMENT_UPDATE, …) pass shouldNotify=true but have no preview
      // content — skip them to match the chime's isCommonMessageFormat guard.
      if (!action.payload.shouldNotify || ((_action$payload$messa = action.payload.message) === null || _action$payload$messa === void 0 ? void 0 : _action$payload$messa['@type']) === PARTIAL_MESSAGE || !isCommonMessageFormat(action.payload.message)) {
        return;
      }
      state.dismissed = false;
      state.previewText = getRichText(action.payload.message) || getPlainText(action.payload.message) || null;
      state.hasAttachment = Boolean(getAttachmentWithType(FILES, action.payload.message));
    });
    builder.addCase(INCREMENT_UNSEEN_COUNT, state => {
      if (!state.dismissed) {
        state.count += 1;
      }
    });
    // New thread started by the visitor: reset so no stale preview is shown
    // while the bot composes its first response.
    builder.addCase(CREATE_NEW_THREAD.SUCCEEDED, resetToInitial);
    // User read the messages (widget opened / tab focused while open).
    builder.addCase(CLEAR_UNSEEN_COUNT_FOR_CHANNEL, state => {
      state.previewText = null;
      state.hasAttachment = false;
    });
    // Widget opened or closed: clear any preview so messages seen in the open
    // widget do not ghost as a stale popup after the widget closes, and so
    // opening clears the popup badge cleanly.
    builder.addCase(toggleOpenAction, resetToInitial);
    // User replied: reset display state so the bot's next response can show.
    builder.addCase(PUBLISH_MESSAGE.SUCCEEDED, resetToInitial);
  }
});
export const {
  dismissNewMessagePreviewPopup
} = newMessagePreviewPopupSlice.actions;
export default newMessagePreviewPopupSlice.reducer;