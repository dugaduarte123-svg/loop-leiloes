/* hs-eslint ignored failing-rules */

'use es6';

import {
    createAction
} from '@reduxjs/toolkit';
import {
    CONSENT_TO_COMMUNICATE,
    CONSENT_TO_COMMUNICATE_SUCCEEDED,
    CONSENT_TO_COMMUNICATE_FAILED
} from '../constants/ActionTypes';
import {
    sendConsentToCommunicate
} from '../client/ConsentToCommunicateClient';
import {
    updateSessionId
} from '../../widget-data/actions/updateSessionId';
import {
    getSessionId
} from '../../selectors/widgetDataSelectors/getSessionId';
import {
    getSelectedThreadId
} from '../../selected-thread/selectors/getSelectedThreadId';
import {
    getHubspotUtk
} from '../../query-params/hubspotUtk';
export const clickedConsentToCommunicate = createAction(CONSENT_TO_COMMUNICATE);
export const consentToCommunicateSucceeded = createAction(CONSENT_TO_COMMUNICATE_SUCCEEDED);
export const consentToCommunicateFailed = createAction(CONSENT_TO_COMMUNICATE_FAILED, error => ({
    payload: {
        error
    }
}));
export function visitorConsentsToCommunicate(consent = false) {
    if (consent) {
        return (dispatch, getState) => {
            const sessionId = getSessionId(getState());
            const threadId = getSelectedThreadId(getState());
            const hubspotUtk = getHubspotUtk();
            dispatch(clickedConsentToCommunicate());
            const successCb = ({
                sessionId: newSessionId
            } = {}) => {
                dispatch(updateSessionId(newSessionId));
                dispatch(consentToCommunicateSucceeded());
            };
            const failureCb = error => {
                dispatch(consentToCommunicateFailed(error));
            };
            sendConsentToCommunicate({
                sessionId,
                hubspotUtk,
                threadId
            }).then(successCb, failureCb).catch(err => {
                setTimeout(() => {
                    throw err;
                });
            });
        };
    }
    return null;
}