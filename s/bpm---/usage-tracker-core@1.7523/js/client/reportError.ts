import { mergeErrorCauseWithSentry } from '../common/errors';
import { lWindow } from '../common/helpers';
import { hasRaven } from './browserHelper';
function reportError(error, options = {}) {
  if (typeof lWindow === 'object' && hasRaven(lWindow)) {
    lWindow.Raven.captureException(error, mergeErrorCauseWithSentry(error, Object.assign({}, options, {
      level: 'error'
    })));
  }
}
export default reportError;