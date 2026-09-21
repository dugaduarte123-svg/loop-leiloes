import { createAction } from '@reduxjs/toolkit';
import { REMOVE_TIME_ON_PAGE_TRIGGER } from '../constants/timeOnPageTriggerActionTypes';
export const removeTimeOnPageTriggerAction = createAction(REMOVE_TIME_ON_PAGE_TRIGGER);