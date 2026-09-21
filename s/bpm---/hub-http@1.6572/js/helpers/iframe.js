'use es6';

import {
    onResponse
} from '../middlewares/core';
import {
    responseError
} from './response';
export const UNAUTHORIZED_MESSAGE = 'unauthorized';
export const PORTAL_MOVED_MESSAGE = 'portal moved';
export const MIGRATION_IN_PROGRESS_MESSAGE = 'migration in progress';
export function maybeGetParentIframe() {
    try {
        if (window.self !== window.top) {
            return window.top;
        }
    } catch (e) {
        return null;
    }
    return null;
}
export const notifyParentAndRejectOnStatuses = (statuses, parentWindow, message) => onResponse(response => {
    if (statuses.includes(response.status)) {
        parentWindow.postMessage(message, '*');
        return Promise.reject(responseError(response, `Aborting: notifying parents of ${message} response`));
    }
    return response;
});