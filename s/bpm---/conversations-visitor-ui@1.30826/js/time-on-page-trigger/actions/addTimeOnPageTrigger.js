'use es6';

import {
    timeOnPageTriggerDelaySeconds
} from '../operators/timeOnPageTriggerDelaySeconds';
import {
    addTimeOnPageTriggerAction
} from './addTimeOnPageTriggerAction';
import {
    removeTimeOnPageTrigger
} from './removeTimeOnPageTrigger';
import {
    executeTimeOnPageTrigger
} from '../../client-triggers/actions/executeTimeOnPageTrigger';
export const addTimeOnPageTrigger = widgetData => dispatch => {
    dispatch(removeTimeOnPageTrigger());
    const delaySeconds = timeOnPageTriggerDelaySeconds(widgetData);
    const delayMilliseconds = delaySeconds * 1000;
    const timeoutId = setTimeout(() => {
        dispatch(executeTimeOnPageTrigger());
    }, delayMilliseconds);
    dispatch(addTimeOnPageTriggerAction(timeoutId));
};