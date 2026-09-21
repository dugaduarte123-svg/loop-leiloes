import { getSpamProtectionMetadata } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import Raven from 'raven-js';
import { isInPreview } from './isInPreview';
export const getSpamProtectionResponse = widgetData => {
  var _window;
  if (!isInPreview() && (_window = window) !== null && _window !== void 0 && (_window = _window.grecaptcha) !== null && _window !== void 0 && _window.enterprise) {
    const spamProtectionMetadata = getSpamProtectionMetadata(widgetData);
    if (!spamProtectionMetadata) {
      return null;
    }
    if (!spamProtectionMetadata.token) {
      return null;
    }
    const spamProtectionToken = spamProtectionMetadata.token;
    return new Promise(resolve => {
      window.grecaptcha.enterprise.ready(() => {
        window.grecaptcha.enterprise.execute(spamProtectionToken, {
          action: spamProtectionMetadata.action
        }).then(generatedToken => {
          resolve({
            generatedToken,
            action: spamProtectionMetadata.action
          });
        }).catch(error => {
          Raven.captureException(error);
          resolve(null);
        });
      });
    });
  }
  return null;
};