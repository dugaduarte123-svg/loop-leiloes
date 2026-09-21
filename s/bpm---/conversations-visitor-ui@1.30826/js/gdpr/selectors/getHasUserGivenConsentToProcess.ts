import { createSelector } from '@reduxjs/toolkit';
import { getConsentToProcessStatus } from './getConsentToProcessStatus';
import { SHOULD_ASK_FOR_CONSENT, SHOULD_NOT_ASK_FOR_CONSENT, UNDETERMINED } from 'conversations-internal-schema/widget-data/records/GDPRConsentToProcessStatusTypes';
export const getUserHasGivenConsentToProcess = createSelector([getConsentToProcessStatus], consentToProcessStatus => {
  switch (consentToProcessStatus) {
    case SHOULD_ASK_FOR_CONSENT:
      return false;
    case SHOULD_NOT_ASK_FOR_CONSENT:
      return true;
    case UNDETERMINED:
    default:
      try {
        return localStorage.getItem('userHasGivenConsentToProcess');
      } catch (e) {
        return false;
      }
  }
});