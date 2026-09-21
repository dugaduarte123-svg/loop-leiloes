import { createAction } from '@reduxjs/toolkit';
import * as ActionTypes from '../../constants/VisitorActionTypes';
export const networkOffline = createAction(ActionTypes.NETWORK_OFFLINE);