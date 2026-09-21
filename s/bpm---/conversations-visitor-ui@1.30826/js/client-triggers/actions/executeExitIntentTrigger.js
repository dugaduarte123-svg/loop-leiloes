'use es6';

import {
    updateShowExitIntentCookieBanner
} from '../../visitor-identity/actions/updateShowExitIntentCookieBanner';
import {
    getLatestWidgetData
} from '../../widget-data/selectors/getLatestWidgetData';
import {
    gdprCookieConsentOnExitIntentEnabled
} from '../../utils/gdprCookieConsentPromptHelpers';
import {
    postStopTrackExitIntent
} from '../../exit-intent-trigger/postStopTrackExitIntent';
import {
    exitIntentTriggerEnabled
} from '../../exit-intent-trigger/operators/exitIntentTriggerEnabled';
import {
    toggleOpen
} from '../../actions/WidgetActions';
import {
    toggleInitialMessageBubble
} from '../../initial-message-bubble/actions/toggleInitialMessageBubble';
import {
    getTriggerConditions
} from './getTriggerConditions';
export const executeExitIntentTrigger = () => (dispatch, getState) => {
    postStopTrackExitIntent();
    const currentState = getState();
    const widgetData = getLatestWidgetData(currentState);
    const triggerConditions = getTriggerConditions(currentState, exitIntentTriggerEnabled);
    if (gdprCookieConsentOnExitIntentEnabled(currentState, widgetData)) {
        dispatch(updateShowExitIntentCookieBanner(true));
    }
    if (triggerConditions.hasClientTriggerAlreadyFired) {
        return;
    } else if (triggerConditions.shouldToggleOpen) {
        dispatch(toggleOpen({
            isOpened: true,
            isUser: false
        }));
    } else if (triggerConditions.shouldToggleInitialMessageBubble) {
        dispatch(toggleInitialMessageBubble(true));
    }
};