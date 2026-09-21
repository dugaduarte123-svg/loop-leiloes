'use es6';

import {
    createAction
} from '@reduxjs/toolkit';
import {
    getSessionId
} from '../../selectors/widgetDataSelectors/getSessionId';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import publishEmailCaptureResponseMessage from './publishEmailCaptureResponseMessage';
import * as EmailCaptureClient from '../EmailCaptureClient';
import {
    visitorConsentsToCommunicate
} from '../../gdpr/actions/visitorConsentsToCommunicate';
import {
    trackInteraction
} from '../../usage-tracking/actions/trackInteraction';
import {
    EVENT_NAMES
} from '../../usage-tracking/constants/eventNames';
import {
    postEmailCapturedEvent
} from './postEmailCapturedEvent';
import {
    getThreadByThreadId
} from '../../threads/selectors/getThreadByThreadId';
import {
    getHubspotUtk
} from '../../query-params/hubspotUtk';
import {
    getChannelName
} from '../../threads/operators/threadGetters';
export const sendVisitorEmailAddressRequested = createAction(ActionTypes.SEND_VISITOR_EMAIL_ADDRESS, email => ({
    payload: {
        email
    }
}));
export const sendVisitorEmailAddressFailed = createAction(ActionTypes.SEND_VISITOR_EMAIL_ADDRESS_FAILED, error => ({
    payload: {
        error
    }
}));
export const sendVisitorEmailAddressSucceeded = createAction(ActionTypes.SEND_VISITOR_EMAIL_ADDRESS_SUCCEEDED, email => ({
    payload: {
        email
    }
}));
export function sendVisitorEmailAddress({
    consentToCommunicate = false,
    email,
    threadId
}) {
    return (dispatch, getState) => {
        dispatch(sendVisitorEmailAddressRequested(email));
        const thread = getThreadByThreadId(getState(), {
            threadId
        });
        const channel = getChannelName(thread);
        const sessionId = getSessionId(getState());
        const hubspotUtk = getHubspotUtk();
        const successCb = () => {
            dispatch(sendVisitorEmailAddressSucceeded(email));
            dispatch(publishEmailCaptureResponseMessage({
                channel,
                email,
                threadId
            }));
            postEmailCapturedEvent({
                email
            });
            if (consentToCommunicate) {
                dispatch(visitorConsentsToCommunicate(consentToCommunicate));
            }
            dispatch(trackInteraction(EVENT_NAMES.WIDGET_INTERACTION, {
                action: 'submit email'
            }));
            return {
                error: null
            };
        };
        const failureCb = error => {
            dispatch(sendVisitorEmailAddressFailed(error));
            return {
                error
            };
        };
        return EmailCaptureClient.sendVisitorEmailAddress({
            threadId,
            email,
            sessionId,
            hubspotUtk
        }).then(successCb, failureCb);
    };
}