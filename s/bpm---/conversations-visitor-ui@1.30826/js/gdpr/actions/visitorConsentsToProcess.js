/* hs-eslint ignored failing-rules */

'use es6';

import {
    createAsyncThunk
} from '@reduxjs/toolkit';
import {
    getSessionId
} from '../../selectors/widgetDataSelectors/getSessionId';
import {
    getMessageId
} from '../../selectors/widgetDataSelectors/getMessageId';
import {
    sendConsentToProcess
} from '../client/ConsentToProcessClient';
import {
    handleStoreMessagesCookie
} from '../../post-message/handleStoreMessagesCookie';
import {
    gdprCookieConsentOnExitIntentEnabled
} from '../../utils/gdprCookieConsentPromptHelpers';
import {
    updateSessionId
} from '../../widget-data/actions/updateSessionId';
import {
    getHubspotUtk
} from '../../query-params/hubspotUtk';
import {
    trackInteraction
} from '../../usage-tracking/actions/trackInteraction';
import {
    EVENT_NAMES
} from '../../usage-tracking/constants/eventNames';
import {
    getLatestWidgetData
} from '../../widget-data/selectors/getLatestWidgetData';
import {
    getMessagesUtk
} from '../../query-params/getMessagesUtk';
export const saveConsentToProcess = createAsyncThunk('gdpr/saveConsentToProcess', ({
    sessionId,
    hubspotUtk,
    welcomeMessageId,
    widgetData
}, {
    dispatch,
    getState
}) => {
    return sendConsentToProcess({
        sessionId,
        hubspotUtk,
        welcomeMessageId,
        widgetData
    }).then(response => {
        const {
            sessionId: newSessionId
        } = response;
        const cookieConsentOnExitEnabled = gdprCookieConsentOnExitIntentEnabled(getState(), widgetData);
        try {
            localStorage.setItem('userHasGivenConsentToProcess', true);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('local storage not set!');
        }
        if (!cookieConsentOnExitEnabled) {
            handleStoreMessagesCookie(getMessagesUtk());
        }
        dispatch(updateSessionId(newSessionId));
        dispatch(trackInteraction(EVENT_NAMES.WIDGET_INTERACTION, {
            action: 'clicked consent to process button'
        }));
    }).catch(error => {
        throw error;
    });
});
export function consentToProcess() {
    return (dispatch, getState) => {
        const sessionId = getSessionId(getState());
        const welcomeMessageId = getMessageId(getState());
        const hubspotUtk = getHubspotUtk();
        const widgetData = getLatestWidgetData(getState());
        dispatch(saveConsentToProcess({
            sessionId,
            hubspotUtk,
            welcomeMessageId,
            widgetData
        }));
    };
}