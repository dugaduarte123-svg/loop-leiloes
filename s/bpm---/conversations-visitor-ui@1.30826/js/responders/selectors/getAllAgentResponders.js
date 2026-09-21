'use es6';

import {
    AGENT
} from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import {
    createSelector
} from '@reduxjs/toolkit';
import filter from 'transmute/filter';
import {
    getType
} from '../operators/responderKeyGetters';
import {
    getResponders
} from './getResponders';
export const getAllAgentResponders = createSelector([getResponders], respondersMap => {
    return filter((__value, key) => getType(key) === AGENT)(respondersMap);
});