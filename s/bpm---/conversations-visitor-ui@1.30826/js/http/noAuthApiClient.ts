import noAuthHttp from 'conversations-http/clients/noAuthApiClient';
import applyDefaults from './applyDefaults';
const noAuthApiClient = {
  post(url, data) {
    return applyDefaults(noAuthHttp.post, url, data);
  },
  put(url, data) {
    return applyDefaults(noAuthHttp.put, url, data);
  },
  get(url, data) {
    return applyDefaults(noAuthHttp.get, url, data);
  },
  getWithResponse(url, data) {
    return applyDefaults(noAuthHttp.getWithResponse, url, data);
  },
  delete(url, data) {
    return applyDefaults(noAuthHttp.delete, url, data);
  }
};
export default noAuthApiClient;