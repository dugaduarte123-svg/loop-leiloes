import { createSelector } from '@reduxjs/toolkit';
import get from 'transmute/get';
import { getWelcomeMessage } from './getWelcomeMessage';
export const getInitialMessageText = createSelector(getWelcomeMessage, get('initialMessage'));