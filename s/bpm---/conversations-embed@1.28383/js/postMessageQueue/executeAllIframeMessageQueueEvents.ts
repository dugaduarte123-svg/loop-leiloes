import { postMessageToIframe } from './postMessageToIframe';
export const executeAllIframeMessageQueueEvents = ({
  iframe,
  iframeSrc,
  eventQueue
}) => {
  do {
    const event = eventQueue.dequeue();
    if (event) {
      const {
        type,
        data
      } = event;
      postMessageToIframe({
        iframe,
        iframeSrc,
        type,
        data
      });
    }
  } while (eventQueue.peek() && Object.keys(eventQueue.peek()).length !== 0);
};