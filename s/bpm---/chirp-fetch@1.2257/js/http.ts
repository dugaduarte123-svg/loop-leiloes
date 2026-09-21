export class HttpError extends Error {
  constructor(status, statusText, responseJSON, responseText) {
    super(`HTTP ${status} ${statusText}`);
    this.name = 'HttpError';
    this.status = status;
    this.statusText = statusText;
    this.responseJSON = responseJSON;
    this.responseText = responseText;
  }
}
function buildUrl(url, query) {
  if (!query || Object.keys(query).length === 0) {
    return url;
  }
  const params = new URLSearchParams(query);
  return `${url}${url.includes('?') ? '&' : '?'}${params}`;
}
function createTimeout(ms) {
  if (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal) {
    return {
      signal: AbortSignal.timeout(ms),
      clear: () => {}
    };
  }
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(id)
  };
}
const NO_BODY_STATUSES = new Set([204, 205, 304]);
function buildInit(method, opts) {
  const headers = {};
  if ((opts === null || opts === void 0 ? void 0 : opts.data) !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (opts !== null && opts !== void 0 && opts.headers) {
    Object.assign(headers, opts.headers);
  }
  const init = {
    method
  };
  let requestTimeout;
  if (Object.keys(headers).length > 0) {
    init.headers = headers;
  }
  if ((opts === null || opts === void 0 ? void 0 : opts.data) !== undefined) {
    init.body = JSON.stringify(opts.data);
  }
  if ((opts === null || opts === void 0 ? void 0 : opts.timeout) !== undefined) {
    const timeout = createTimeout(opts.timeout);
    init.signal = timeout.signal;
    requestTimeout = timeout.clear;
  }
  return {
    init,
    requestTimeout
  };
}
export function withHttpMethods(fetchFn) {
  const makeMethod = method => async (url, opts) => {
    const fullUrl = buildUrl(url, opts === null || opts === void 0 ? void 0 : opts.query);
    const {
      init,
      requestTimeout
    } = buildInit(method, opts);
    try {
      const response = await fetchFn(fullUrl, init);
      if (!response.ok) {
        const text = await response.text().catch(() => '');
        let json = null;
        try {
          json = JSON.parse(text);
        } catch (_unused) {
          // not JSON
        }
        throw new HttpError(response.status, response.statusText, json, text);
      }
      if (method === 'HEAD' || method === 'OPTIONS' || NO_BODY_STATUSES.has(response.status) || response.headers.get('content-length') === '0') {
        return null;
      }
      return response.json();
    } finally {
      requestTimeout === null || requestTimeout === void 0 || requestTimeout();
    }
  };
  const client = (input, init) => fetchFn(input, init);
  client.get = makeMethod('GET');
  client.post = makeMethod('POST');
  client.put = makeMethod('PUT');
  client.patch = makeMethod('PATCH');
  client.delete = makeMethod('DELETE');
  client.options = makeMethod('OPTIONS');
  client.head = makeMethod('HEAD');
  return client;
}