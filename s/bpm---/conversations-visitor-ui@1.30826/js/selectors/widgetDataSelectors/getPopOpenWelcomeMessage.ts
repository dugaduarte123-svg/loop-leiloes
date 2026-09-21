import { createSelector } from '@reduxjs/toolkit';
import { getWelcomeMessage } from './getWelcomeMessage';
export const getPopOpenWelcomeMessage = createSelector(getWelcomeMessage, (welcomeMessage = {}) => !!welcomeMessage.popOpenWelcomeMessage);