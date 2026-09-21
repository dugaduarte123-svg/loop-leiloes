import { createAction } from '@reduxjs/toolkit';
import { CLEAR_SELECTED_THREAD } from '../constants/selectedThreadActionTypes';
export const clearSelectedThread = createAction(CLEAR_SELECTED_THREAD);