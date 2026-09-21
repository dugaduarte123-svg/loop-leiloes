import get from 'transmute/get';
import { createSelector } from '@reduxjs/toolkit';
const getEmailCaptureStatus = get('emailCapture');
export const getHasVisitorEmail = createSelector(getEmailCaptureStatus, get('hasVisitorEmail'));