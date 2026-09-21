import { objectInvariant } from '../invariants/objectInvariant';
import { stringInvariant } from '../invariants/stringInvariant';
import { EMAIL_CAPTURED } from './constants/eventTypeConstants';
import { isEmailCapturedEventEnabled } from '../external-api/settingsHelpers';
export const handleExternalApiEventMessage = ({
  data
}, {
  eventEmitter
}) => {
  stringInvariant(data.eventType);
  objectInvariant(data.payload);
  if (data.eventType === EMAIL_CAPTURED && !isEmailCapturedEventEnabled()) {
    return;
  }
  eventEmitter.trigger(data.eventType, data.payload);
};