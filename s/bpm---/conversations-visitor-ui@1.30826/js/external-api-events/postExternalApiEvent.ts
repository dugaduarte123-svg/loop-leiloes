import { postMessageToParent } from '../post-message/postMessageToParent';
import { EXTERNAL_API_EVENT } from './constants/externalApiEventsPostMessageTypes';
export const postExternalApiEvent = ({
  eventType,
  payload
}) => {
  postMessageToParent(EXTERNAL_API_EVENT, {
    eventType,
    payload
  });
};