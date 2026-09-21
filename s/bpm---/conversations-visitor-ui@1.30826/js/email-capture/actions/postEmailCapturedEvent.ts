import { postExternalApiEvent } from '../../external-api-events/postExternalApiEvent';
import { EMAIL_CAPTURED } from '../../external-api-events/constants/externalApiEventTypes';
export const postEmailCapturedEvent = ({
  email
}) => {
  postExternalApiEvent({
    eventType: EMAIL_CAPTURED,
    payload: {
      email
    }
  });
};