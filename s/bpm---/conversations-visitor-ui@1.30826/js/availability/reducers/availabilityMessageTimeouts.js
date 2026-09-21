'use es6';

import {
    Map as ImmutableMap
} from 'immutable';
import {
    handleActions
} from 'flux-actions';
import {
    ADD_AVAILABILITY_MESSAGE_TIMEOUT
} from '../constants/actionTypes';
const initialState = ImmutableMap();
export default handleActions({
    [ADD_AVAILABILITY_MESSAGE_TIMEOUT]: (state, action) => {
        const {
            channel,
            timeout
        } = action.payload;
        return state.set(channel, timeout);
    }
}, initialState);