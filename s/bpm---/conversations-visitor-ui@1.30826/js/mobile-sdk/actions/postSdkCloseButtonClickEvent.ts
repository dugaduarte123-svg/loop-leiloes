import { postExternalApiEvent } from '../../external-api-events/postExternalApiEvent';
import { SDK_CLOSE_BUTTON_CLICK } from '../../external-api-events/constants/externalApiEventTypes';
export const postSdkCloseButtonClickEvent = () => {
  postExternalApiEvent({
    eventType: SDK_CLOSE_BUTTON_CLICK,
    payload: {
      timestamp: Date.now()
    }
  });
};