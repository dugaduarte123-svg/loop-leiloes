import { postExternalApiEvent } from '../external-api-events/postExternalApiEvent';
import { USER_INTERACTED_WITH_WIDGET } from '../external-api-events/constants/externalApiEventTypes';
export const postUserInteractedWithWidgetEvent = () => {
  postExternalApiEvent({
    eventType: USER_INTERACTED_WITH_WIDGET,
    payload: {
      message: 'User has interacted with the widget'
    }
  });
};