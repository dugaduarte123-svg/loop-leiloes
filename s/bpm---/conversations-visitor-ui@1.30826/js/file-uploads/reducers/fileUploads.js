'use es6';

import getIn from 'transmute/getIn';
import {
    handleActions
} from 'flux-actions';
import {
    Map as ImmutableMap,
    OrderedMap as ImmutableOrderedMap
} from 'immutable';
import {
    setFileId,
    setUploadProgress
} from 'conversations-internal-schema/file-upload/operators/fileUploadSetters';
import {
    getLocalId
} from 'conversations-internal-schema/file-upload/operators/fileUploadGetters';
import {
    ATTACHMENT_UPLOAD_PROGRESS,
    ATTACHMENT_UPLOAD_START,
    ATTACHMENT_UPLOAD_COMPLETE,
    REMOVE_ATTACHMENT,
    ATTACHMENT_ERROR,
    CLEAR_ATTACHMENTS
} from '../constants/fileUploadsActionTypes';
import {
    RESET_STUBBED_THREAD
} from '../../stubbed-thread-history/constants/StubbedThreadHistoryActionTypes';
import {
    STUBBED_THREAD_ID
} from '../../threads/constants/stubbedThreadId';
import {
    fileIsUploadingInThread
} from '../operators/fileIsUploadingInThread';
const initialState = new ImmutableMap();

// this reducer is the main store for the file upload component
// resolved thread-view attachments are fetched on demand via the
// useResolvedFileAttachments Pulse hook (not stored in Redux)
const reducer = {
    [ATTACHMENT_UPLOAD_START]: (state, action) => {
        const {
            attachment,
            threadId
        } = action.payload;
        return state.withMutations(mutableState => {
            if (!getIn([threadId], mutableState)) {
                mutableState.set(threadId, new ImmutableOrderedMap());
            }
            mutableState.setIn([threadId, getLocalId(attachment)], attachment);
        });
    },
    [ATTACHMENT_UPLOAD_PROGRESS]: (state, action) => {
        const {
            localId,
            progress,
            threadId
        } = action.payload;
        if (!fileIsUploadingInThread({
                localId,
                threadId
            }, state)) {
            return state;
        }
        return state.updateIn([threadId, localId], attachment => {
            return setUploadProgress(progress, attachment);
        });
    },
    [ATTACHMENT_UPLOAD_COMPLETE]: (state, action) => {
        const {
            fileId,
            localId,
            threadId
        } = action.payload;
        if (!fileIsUploadingInThread({
                localId,
                threadId
            }, state)) {
            return state;
        }
        return state.updateIn([threadId, localId], attachment => {
            return attachment.withMutations(mutableAttachment => {
                setUploadProgress(100, mutableAttachment);
                setFileId(fileId, mutableAttachment);
            });
        });
    },
    [REMOVE_ATTACHMENT]: (state, action) => {
        const {
            localId,
            threadId
        } = action.payload;
        return state.deleteIn([threadId, localId]);
    },
    [CLEAR_ATTACHMENTS]: (state, action) => {
        const {
            threadId
        } = action.payload;
        return state.delete(threadId);
    },
    [RESET_STUBBED_THREAD]: state => {
        return state.delete(STUBBED_THREAD_ID);
    },
    [ATTACHMENT_ERROR]: (state, action) => {
        const {
            threadId
        } = action.payload;
        return state.deleteIn([threadId]);
    }
};
export default handleActions(reducer, initialState);