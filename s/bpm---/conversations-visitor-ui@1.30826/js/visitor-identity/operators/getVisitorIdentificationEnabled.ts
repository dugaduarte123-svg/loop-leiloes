import { createSelector } from '@reduxjs/toolkit';
import get from 'transmute/get';
export const getVisitorIdentification = data => get('visitorIdentification', data);
export const getVisitorIdentificationEnabled = createSelector([getVisitorIdentification], visitorIdentification => visitorIdentification.enabled);