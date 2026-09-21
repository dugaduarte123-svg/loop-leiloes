'use es6';

import pipe from 'transmute/pipe';
import {
    getMessage
} from './widgetDataGetters';
import {
    getGdprExplicitConsentRequired
} from '../../message/operators/messageGetters';
export const gdprExplicitConsentRequired = pipe(getMessage, getGdprExplicitConsentRequired);