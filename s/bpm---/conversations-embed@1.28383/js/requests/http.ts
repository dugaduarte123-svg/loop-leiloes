export const DONE_STATE = 4;
const requestFailed = statusCode => statusCode >= 300;
export const doRequest = method => (url, body) => callback => {
  const request = new XMLHttpRequest();
  request.addEventListener('readystatechange', () => {
    if (request.readyState !== DONE_STATE) {
      return;
    }
    try {
      const json = JSON.parse(request.responseText);
      if (requestFailed(request.status)) {
        callback(null, json);
      } else {
        callback(json);
      }
    } catch (e) {
      callback(null, 'Invalid api response');
    }
  });
  request.open(method, url);
  request.send(body);
  return request;
};
export const get = doRequest('GET');
export const post = doRequest('POST');
export const put = doRequest('PUT');