'use es6';

import {
    MAX_UPLOAD_PROGRESS_PERCENTAGE
} from '../constants/fileUploadsConstants';
import {
    attachmentUploadProgress
} from '../../file-uploads/actions/attachmentUploadProgress';
export const handleAttachmentUploadProgress = ({
    localId,
    threadId,
    loaded,
    total
}) => dispatch => {
    const actualProgress = loaded / total;
    const cappedProgressPercentage = actualProgress * MAX_UPLOAD_PROGRESS_PERCENTAGE;
    dispatch(attachmentUploadProgress({
        localId,
        threadId,
        progress: cappedProgressPercentage
    }));
};