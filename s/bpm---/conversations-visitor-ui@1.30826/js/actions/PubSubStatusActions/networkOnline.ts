import { createAction } from '@reduxjs/toolkit';
import * as ActionTypes from '../../constants/VisitorActionTypes';
export const networkOnline = createAction(ActionTypes.NETWORK_ONLINE);