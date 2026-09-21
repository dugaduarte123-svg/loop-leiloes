'use es6';

import pipe from 'transmute/pipe';
import {
    getMessage
} from './widgetDataGetters';
import {
    getDisplayBotQuickRepliesOutsideChat
} from '../../message/operators/messageGetters';
export const displayBotQuickRepliesOutsideChat = pipe(getMessage, getDisplayBotQuickRepliesOutsideChat);