'use es6';

import getIn from 'transmute/getIn';
import {
    CURRENT_STATUS,
    PREVIOUS_STATUS,
    AUDIT
} from '../constants/keyPaths';
export const getCurrentStatus = getIn(CURRENT_STATUS);
export const getPreviousStatus = getIn(PREVIOUS_STATUS);
export const getAudt = getIn(AUDIT);