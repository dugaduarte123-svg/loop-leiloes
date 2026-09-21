'use es6';

export default ((url, onsuccess, {
    onerror,
    headers = {},
    withCredentials = false,
    data = {}
} = {}) => {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
            const {
                responseText,
                status
            } = request;
            if (status >= 200 && status < 300) {
                const response = responseText ? JSON.parse(responseText) : {};
                onsuccess(response);
            } else if (onerror) {
                onerror(request);
            }
        }
    };
    request.open('POST', url);
    if (withCredentials) {
        request.withCredentials = true;
    }
    Object.keys(headers).forEach(key => {
        request.setRequestHeader(key, headers[key]);
    });
    request.send(JSON.stringify(data));
});