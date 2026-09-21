import I18n from 'I18n';
import { createSelector } from '@reduxjs/toolkit';
import { getWelcomeMessage } from './getWelcomeMessage';
export const getAskForEmailMessage = createSelector(getWelcomeMessage, (welcomeMessage = {}) => {
  if (!(welcomeMessage !== null && welcomeMessage !== void 0 && welcomeMessage.askForEmailMessage)) {
    return I18n.text('conversations-visitor-ui.askForEmailMessage');
  }
  return welcomeMessage.askForEmailMessage;
});