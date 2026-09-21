// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
  bender
} = require('legacy-hubspot-bender-context');
import { getMessagesUtk } from '../query-params/getMessagesUtk';
import { handleResolve } from './handleResolve';
export default function applyDefaults(method, url, data) {
  data.query = Object.assign({
    [bender.project]: bender.depVersions[bender.project],
    traceId: getMessagesUtk()
  }, data.query);
  return new Promise((resolve, reject) => {
    method(url, Object.assign({}, data)).then(handleResolve(resolve)).catch(reject);
  });
}