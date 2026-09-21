'use es6';

import noAuthHttp from '../../http/noAuthApiClient';
const ATTACHMENT_UPLOAD_URL_PATH = 'livechat-public/v1/attachment/upload-url';
export const fetchAttachmentUploadUrlClient = ({
    sessionId,
    threadId
}) => {
    return noAuthHttp.get(ATTACHMENT_UPLOAD_URL_PATH, {
        query: {
            sessionId,
            threadId
        }
    });
};