import { postExternalApiEvent } from '../external-api-events/postExternalApiEvent';
import { WIDGET_CLOSED } from '../external-api-events/constants/externalApiEventTypes';
export const postWidgetClosedEvent = () => {
  postExternalApiEvent({
    eventType: WIDGET_CLOSED,
    payload: {
      message: 'widget is closed'
    }
  });
};