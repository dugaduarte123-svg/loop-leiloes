'use es6';

import {
    handleActions
} from 'flux-actions';
import {
    Map as ImmutableMap
} from 'immutable';
import {
    ATTACHMENT_ERROR,
    DISMISS_ATTACHMENTS_ERROR,
    ATTACHMENT_UPLOAD_START,
    REMOVE_ATTACHMENT
} from '../constants/fileUploadsActionTypes';
const initialState = new ImmutableMap();
const reducer = {
    [ATTACHMENT_ERROR]: (state, action) => {
        const {
            error,
            threadId
        } = action.payload;
        return state.set(threadId, error);
    },
    [DISMISS_ATTACHMENTS_ERROR]: (state, action) => {
        const {
            threadId
        } = action.payload;
        return state.delete(threadId);
    },
    [ATTACHMENT_UPLOAD_START]: (state, action) => {
        const {
            threadId
        } = action.payload;
        return state.delete(threadId);
    },
    [REMOVE_ATTACHMENT]: (state, action) => {
        const {
            threadId
        } = action.payload;
        return state.delete(threadId);
    }
};
export default handleActions(reducer, initialState);