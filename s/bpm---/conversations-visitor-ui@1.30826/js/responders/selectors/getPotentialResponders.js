'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    buildPotentialResponders
} from 'conversations-internal-schema/widget-data/operators/buildPotentialResponders';
import {
    getSendFromResponders
} from '../../responders/selectors/getSendFromResponders';
import {
    getAgentRespondersList
} from './getAgentRespondersList';
export const getPotentialResponders = createSelector([getSendFromResponders, getAgentRespondersList], buildPotentialResponders);