'use es6';

// this client needs to use the base no-auth
// the request to file manager will not succeed with additional query params
import noAuthHttp from 'conversations-http/clients/noAuthApiClient';
export const uploadAttachmentClient = ({
    formData,
    uploadUrl,
    onProgress = () => {}
}) => {
    return noAuthHttp.post(uploadUrl, {
        headers: {
            'content-type': false
        },
        data: formData,
        timeout: 0,
        withXhr: xhr => {
            xhr.upload.addEventListener('progress', onProgress, false);
        }
    });
};