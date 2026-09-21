'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    getSelectedThread
} from '../../selected-thread/selectors/getSelectedThread';
import {
    typingResponder
} from './typingResponder';
export const getTypingResponderFromCurrentThread = createSelector([state => state, getSelectedThread], (state, selectedThread) => typingResponder(state, {
    thread: selectedThread
}));