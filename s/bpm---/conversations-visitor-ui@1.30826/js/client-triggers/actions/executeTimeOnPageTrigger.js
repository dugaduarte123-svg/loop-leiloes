'use es6';

import {
    toggleOpen
} from '../../actions/WidgetActions';
import {
    toggleInitialMessageBubble
} from '../../initial-message-bubble/actions/toggleInitialMessageBubble';
import {
    removeTimeOnPageTrigger
} from '../../time-on-page-trigger/actions/removeTimeOnPageTrigger';
import {
    timeOnPageTriggerEnabled
} from '../../time-on-page-trigger/operators/timeOnPageTriggerEnabled';
import {
    getTriggerConditions
} from './getTriggerConditions';
export const executeTimeOnPageTrigger = () => (dispatch, getState) => {
    dispatch(removeTimeOnPageTrigger());
    const currentState = getState();
    const triggerConditions = getTriggerConditions(currentState, timeOnPageTriggerEnabled);
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