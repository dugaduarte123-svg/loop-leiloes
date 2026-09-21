'use es6';

import {
    handleActions,
    combineActions
} from 'flux-actions';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import {
    REFRESH_WIDGET_DATA,
    UPDATE_SESSION_ID
} from '../constants/actionTypes';
import WidgetData from 'conversations-internal-schema/widget-data/records/WidgetData';
import {
    setSessionId
} from '../operators/setSessionId';
import WidgetColoring from 'conversations-internal-schema/coloring/model/WidgetColoring';
import {
    getData,
    uninitialized,
    started,
    succeeded
} from '../../constants/asyncStatuses';
const initialState = uninitialized(new WidgetData({
    coloring: WidgetColoring()
}));
export default handleActions({
    [ActionTypes.GET_WIDGET_DATA]: state => started(getData(state)),
    [combineActions(ActionTypes.GET_WIDGET_DATA_SUCCEEDED, REFRESH_WIDGET_DATA)]: (_state, action) => succeeded(action.payload),
    [UPDATE_SESSION_ID]: (state, action) => {
        const {
            sessionId
        } = action.payload;
        return Object.assign({}, state, {
            data: setSessionId(sessionId)(getData(state))
        });
    }
    /**
     *
     * Do not mutate values in this reducer. Store state updates in other reducers
     * and use selectors to retrieve values
     *
     */
}, initialState);