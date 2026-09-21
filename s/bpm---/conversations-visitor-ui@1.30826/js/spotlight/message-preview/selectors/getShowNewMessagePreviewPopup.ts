import { createSelector } from '@reduxjs/toolkit';
import { getUseSpotlightLauncher } from '../../../widget-data/selectors/widgetDataSelectors';
import { getIsOpen } from '../../../selectors/getIsOpen';
const getNewMessagePreviewPopupDismissed = state => state.newMessagePreviewPopup.dismissed;

// True whenever the slice has a live preview text or attachment to show.
// Avoids a dependency on calculateUnseenThreadsCount whose thread-map counter
// is NaN for server-pre-created (AI SDR) threads (ADD_CONVERSATION doesn't
// initialize unseenCount, so undefined + 1 = NaN which is falsy).
const getHasPreviewContent = state => state.newMessagePreviewPopup.previewText != null || state.newMessagePreviewPopup.hasAttachment;
export const getShowNewMessagePreviewPopup = createSelector([getUseSpotlightLauncher, getIsOpen, getHasPreviewContent, getNewMessagePreviewPopupDismissed], (useSpotlightLauncher, isOpen, hasPreviewContent, dismissed) => useSpotlightLauncher && !isOpen && hasPreviewContent && !dismissed);