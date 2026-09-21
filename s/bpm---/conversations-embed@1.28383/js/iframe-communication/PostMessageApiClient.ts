import { doRequest, DONE_STATE } from '../requests/http';
import { API_REQUEST_RESULT } from './constants/sentPostMessageTypes';
export class PostMessageApiClient {
  constructor(postMessage) {
    this.makeApiRequest = ({
      data
    }) => {
      const {
        type,
        url,
        data: requestData
      } = data;
      const fullUrl = `/_hcms${url}`;
      if (this.currentRequest && this.currentRequest.readyState !== DONE_STATE) {
        this.abortCurrentApiRequest();
      }
      this.currentRequest = doRequest(type)(fullUrl, requestData)((result, error) => {
        if (!error) {
          this.postMessage(API_REQUEST_RESULT, {
            result: 'succeeded',
            data: result,
            url
          });
        } else {
          this.postMessage(API_REQUEST_RESULT, {
            result: 'failed',
            data: error,
            url
          });
        }
      });
    };
    this.postMessage = postMessage;
    this.currentRequest = null;
  }
  abortCurrentApiRequest() {
    if (this.currentRequest) {
      this.currentRequest.abort();
    }
  }
}