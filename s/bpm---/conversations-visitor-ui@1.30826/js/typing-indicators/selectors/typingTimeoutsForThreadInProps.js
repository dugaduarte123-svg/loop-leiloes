'use es6';

import {
    Map as ImmutableMap
} from 'immutable';
import {
    createSelector
} from '@reduxjs/toolkit';
import get from 'transmute/get';
import {
    getThreadId
} from '../../threads/operators/threadGetters';
import {
    threadFromProps
} from '../../threads/selectors/threadFromProps';
import {
    typingStates as typingStatesSelector
} from './typingStates';
export const typingTimeoutsForThreadInProps = createSelector([threadFromProps, typingStatesSelector], (thread, typingStates) => {
    const threadId = getThreadId(thread);
    return get(`${threadId}`, typingStates) || ImmutableMap();
});