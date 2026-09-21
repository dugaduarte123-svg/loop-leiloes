'use es6';

import {
    handleActions
} from 'flux-actions';
import {
    UPDATE_VIEW
} from '../constants/actionTypes';
const initialState = null;
const currentView = handleActions({
    [UPDATE_VIEW]: (state, action) => {
        const {
            view
        } = action.payload;
        return view;
    }
}, initialState);
export default currentView;