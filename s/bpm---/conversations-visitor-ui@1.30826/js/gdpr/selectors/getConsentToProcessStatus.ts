import get from 'transmute/get';
import { createSelector } from '@reduxjs/toolkit';
const getGdpr = get('gdpr');
export const getConsentToProcessStatus = createSelector([getGdpr], gdpr => gdpr.consentToProcessStatus);