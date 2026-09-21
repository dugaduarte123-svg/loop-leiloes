'use es6';

import {
    getFileId
} from 'conversations-internal-schema/file-upload/operators/fileUploadGetters';
import {
    isUploadCompleted
} from 'conversations-internal-schema/file-upload/operators/isUploadCompleted';
import FileAttachment from 'conversations-message-history/common-message-format/records/FileAttachment';

/*
 * @param {List<FileUploadRecord>} fileUploads
 * @returns {FileAttachment}
 */
export const buildFileAttachment = fileUploads => {
    if (!fileUploads) {
        return null;
    }
    const fileIds = fileUploads.filter(isUploadCompleted).map(getFileId);
    if (!fileIds.size) {
        return null;
    }
    return FileAttachment({
        fileIds
    });
};