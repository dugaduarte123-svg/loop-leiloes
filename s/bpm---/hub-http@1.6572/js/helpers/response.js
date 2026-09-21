'use es6';

import {
    push
} from './update';
const responseHandlersKey = Symbol('responseHandlers');
export const responseHandlers = options => options[responseHandlersKey];
export const handleResponse = handler => push(responseHandlersKey, handler);
export const responseError = (response, message, code, previousError) => Object.assign(new Error(), response, {
    message,
    code,
    previousError
});