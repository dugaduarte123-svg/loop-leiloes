import { createSelector } from '@reduxjs/toolkit';
import get from 'transmute/get';
import { getWelcomeMessage } from './getWelcomeMessage';
export const getMessageId = createSelector(getWelcomeMessage, get('id'));