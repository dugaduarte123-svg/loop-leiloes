import { createSelector } from '@reduxjs/toolkit';
import get from 'transmute/get';
import { getWelcomeMessage } from './getWelcomeMessage';
export const getCustomEmailCaptureDelay = createSelector(getWelcomeMessage, get('customEmailCaptureDelay'));