'use es6';

import {
    Map as ImmutableMap
} from 'immutable';
import {
    handleActions
} from 'flux-actions';
import {
    ADD_TIME_ON_PAGE_TRIGGER,
    REMOVE_TIME_ON_PAGE_TRIGGER
} from '../constants/timeOnPageTriggerActionTypes';
const initialState = ImmutableMap({
    timeoutId: 0
});
const reducer = {
    [ADD_TIME_ON_PAGE_TRIGGER](state, action) {
        const {
            timeoutId
        } = action.payload;
        return state.set('timeoutId', timeoutId, state);
    },
    [REMOVE_TIME_ON_PAGE_TRIGGER](state) {
        return state.set('timeoutId', 0, state);
    }
};
export default handleActions(reducer, initialState);