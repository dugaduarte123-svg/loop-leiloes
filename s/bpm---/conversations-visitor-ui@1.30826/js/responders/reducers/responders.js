'use es6';

import {
    Map as ImmutableMap
} from 'immutable';
import {
    getSendFrom
} from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import {
    getResponder
} from '../../threads/operators/threadGetters';
import {
    handleActions
} from 'flux-actions';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import {
    FETCH_AGENT_RESPONDER_SUCCEEDED
} from '../constants/asyncActionTypes';
import {
    buildResponderKeyFromRequest,
    buildResponderKeyFromResponder
} from '../operators/buildResponderKey';
const initialState = ImmutableMap();
export default handleActions({
    [ActionTypes.GET_WIDGET_DATA_SUCCEEDED](responders, action) {
        const {
            payload
        } = action;
        const allResponders = getSendFrom(payload);
        return allResponders.reduce((respondersMap, newResponder) => {
            const id = buildResponderKeyFromResponder(newResponder);
            return respondersMap.set(id, newResponder);
        }, responders);
    },
    [ActionTypes.GET_VISITOR_THREADS_SUCCESS](responders, action) {
        const {
            threads
        } = action.payload;
        const threadResponders = [];
        threads.forEach(thread => {
            const responder = getResponder(thread);
            if (responder) {
                threadResponders.push(responder);
            }
        });
        return threadResponders.reduce((respondersMap, newResponder) => {
            const id = buildResponderKeyFromResponder(newResponder);
            return respondersMap.set(id, newResponder);
        }, responders);
    },
    [FETCH_AGENT_RESPONDER_SUCCEEDED](responders, {
        payload
    }) {
        const id = buildResponderKeyFromRequest(payload.requestArgs);
        return responders.set(id, payload.data);
    }
}, initialState);