//@ts-ignore untyped-file
import { computeStackTrace } from './computeStackTrace';
import { getPortalId, getMessagesEnv, getMessagesHublet } from '../embed-script-context/envGetters';
import { na1 } from 'hubspot-url-utils/hublets';
const SENTRY_KEY = '7ab6425e7a7c4b01b71fdb51e76514bf';
const XHR_DONE_STATE = 4;
function getTimestampWithMS() {
  return Date.now() / 1000;
}

// copy of sentry's uuid generator
// https://github.com/getsentry/sentry-javascript/blob/a01b4ee7f7ba03167d7424daae2fb2f2206687cb/packages/raven-js/src/utils.js#L261-L301
function uuid4() {
  const crypto = window.crypto || window.msCrypto;
  if (typeof crypto !== undefined && crypto.getRandomValues) {
    // Use window.crypto API if available
    const arr = new Uint16Array(8);
    crypto.getRandomValues(arr);

    // set 4 in byte 7
    // eslint-disable-next-line no-bitwise
    arr[3] = arr[3] & 0xfff | 0x4000;
    // set 2 most significant bits of byte 9 to '10'
    // eslint-disable-next-line no-bitwise
    arr[4] = arr[4] & 0x3fff | 0x8000;
    const pad = function pad(num) {
      let v = num.toString(16);
      while (v.length < 4) {
        v = `0${v}`;
      }
      return v;
    };
    return pad(arr[0]) + pad(arr[1]) + pad(arr[2]) + pad(arr[3]) + pad(arr[4]) + pad(arr[5]) + pad(arr[6]) + pad(arr[7]);
  } else {
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => {
      // eslint-disable-next-line no-bitwise
      const r = Math.random() * 16 | 0;
      // eslint-disable-next-line no-bitwise
      const v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }
}
/* eslint-endable no-bitwise */

function logSentryError(url, data) {
  const request = new XMLHttpRequest();
  request.addEventListener('readystatechange', () => {
    if (request.readyState !== XHR_DONE_STATE) {
      return;
    }
    if (request.status >= 300) {
      // eslint-disable-next-line no-console
      console.warn('Failed logging HSConversations error');
    }
  });
  request.open('POST', url);
  request.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
  request.send(JSON.stringify(data));
}
export class ErrorLogger {
  constructor() {
    const environment = getMessagesEnv();
    const hublet = getMessagesHublet();
    this.config = {
      environment,
      tags: {
        portalId: getPortalId(),
        env: environment,
        project: 'conversations-embed'
      },
      logger: 'javascript',
      platform: 'javascript',
      request: {
        headers: {
          'User-Agent': navigator.userAgent
        },
        url: window.location.href
      }
    };

    // eslint-disable-next-line hubspot-dev/no-hublet-comparison
    const hubletSuffix = hublet == null || hublet === na1 ? '' : `-${hublet}`;
    const envSuffix = environment == null || environment === 'prod' ? '' : 'qa';
    const queryParams = `sentry_version=7&sentry_client=raven-js%2F3.19.1&sentry_key=${SENTRY_KEY}`;
    this.sentryUrl = `https://exceptions${hubletSuffix}.hubspot${envSuffix}.com/v2/api/store/?${queryParams}`;
    this.logError = this.logError.bind(this);
  }
  logError(message) {
    const timestamp = getTimestampWithMS();
    logSentryError(this.sentryUrl, Object.assign({}, this.config, {
      event_id: uuid4(),
      transaction: 'conversations embed error',
      level: 'error',
      exception: {
        values: [{
          mechanism: {
            handled: true,
            type: 'generic'
          },
          type: message,
          value: message
        }]
      },
      timestamp
    }));
  }
  captureErrors(closure) {
    try {
      closure();
    } catch (error) {
      const timestamp = getTimestampWithMS();
      if (error instanceof Error && error.message !== 'Aborting: redirection in progress') {
        const stacktrace = computeStackTrace(error);
        logSentryError(this.sentryUrl, Object.assign({}, this.config, {
          event_id: uuid4(),
          transaction: stacktrace.stack[0].filename,
          level: 'error',
          exception: {
            values: [{
              mechanism: {
                handled: true,
                type: 'generic'
              },
              type: stacktrace.name,
              value: stacktrace.message,
              stacktrace: {
                frames: stacktrace.stack.reverse()
              }
            }]
          },
          timestamp
        }));
      }
      throw error;
    }
  }
}