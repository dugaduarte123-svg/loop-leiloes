import pipe from 'transmute/pipe';
import { getMessage } from './widgetDataGetters';
// @ts-ignore not typed
import { getGdprCookieConsentPromptMessage } from '../../message/operators/messageGetters';
export const gdprCookieConsentPromptMessage = pipe(getMessage, getGdprCookieConsentPromptMessage);