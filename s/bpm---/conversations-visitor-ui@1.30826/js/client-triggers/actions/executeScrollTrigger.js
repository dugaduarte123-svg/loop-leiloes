'use es6';

import {
    toggleOpen
} from '../../actions/WidgetActions';
import {
    toggleInitialMessageBubble
} from '../../initial-message-bubble/actions/toggleInitialMessageBubble';
import {
    scrollTriggerEnabled
} from '../../scroll-percentage-trigger/operators/scrollTriggerEnabled';
import {
    postStopTrackScrollPercentage
} from '../../scroll-percentage-trigger/actions/postStopTrackScrollPercentage';
import {
    getTriggerConditions
} from './getTriggerConditions';
export const executeScrollTrigger = () => (dispatch, getState) => {
    postStopTrackScrollPercentage();
    const currentState = getState();
    const triggerConditions = getTriggerConditions(currentState, scrollTriggerEnabled);
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