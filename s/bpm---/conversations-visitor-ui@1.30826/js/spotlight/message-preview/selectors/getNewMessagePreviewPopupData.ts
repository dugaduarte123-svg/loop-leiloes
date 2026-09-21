import { createSelector } from '@reduxjs/toolkit';
import { getAvatar, getFirstName, getIsBot, getIsOnline, getIsResponderAI, getJobTitle } from 'conversations-internal-schema/responders/operators/responderGetters';
import { getAssignedResponderInWidget } from '../../../responders/selectors/getAssignedResponderInWidget';
import I18n from 'I18n';
const getStoredPreviewText = state => state.newMessagePreviewPopup.previewText;
const getStoredHasAttachment = state => state.newMessagePreviewPopup.hasAttachment;
export const getNewMessagePreviewPopupData = createSelector([getStoredPreviewText, getStoredHasAttachment, getAssignedResponderInWidget], (previewText, hasAttachment, responder) => {
  if (!previewText && !hasAttachment) return;
  const agentAvatarUrl = responder && getAvatar(responder) || undefined;
  const isBot = Boolean(responder && getIsBot(responder));
  const isResponderAI = Boolean(responder && getIsResponderAI(responder));
  const isOnline = Boolean(responder && getIsOnline(responder));
  const agentName = responder && getFirstName(responder) || I18n.text('conversations-visitor-ui.default.agent');
  const agentJobTitle = responder && getJobTitle(responder) || null;
  return {
    agentName,
    agentJobTitle,
    agentAvatarUrl,
    isBot,
    isResponderAI,
    isOnline,
    messagePreviewText: previewText !== null && previewText !== void 0 ? previewText : '',
    hasAttachment
  };
});