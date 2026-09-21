import { createSelector } from '@reduxjs/toolkit';
import { getWelcomeMessage } from './getWelcomeMessage';
export const getPopMessageOnSmallScreens = createSelector(getWelcomeMessage, (welcomeMessage = {}) => !!welcomeMessage.popMessageOnSmallScreens);