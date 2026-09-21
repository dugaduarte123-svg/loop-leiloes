'use es6';

import {
    SIZE_LIMIT_EXCEEDED
} from '../../file-uploads/constants/attachmentErrors';
import {
    fileExceedsSizeLimit
} from './fileExceedsSizeLimit';
import defer from 'hs-promise-utils/defer';
export const validateAttachmentFile = file => {
    const validationDeferred = defer();
    if (fileExceedsSizeLimit(file)) {
        validationDeferred.reject(SIZE_LIMIT_EXCEEDED);
    } else {
        validationDeferred.resolve();
    }
    return validationDeferred.promise;
};