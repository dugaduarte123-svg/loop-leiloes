import { getIframeFromDocumentQuery } from './getIframeFromDocumentQuery';
import { postMessageToIframe } from './postMessageToIframe';
import { executeAllIframeMessageQueueEvents } from './executeAllIframeMessageQueueEvents';
export const createQueue = () => {
  const queue = [];
  return {
    enqueue: event => queue.unshift(event),
    dequeue: () => queue.shift(),
    peek: () => queue[0]
  };
};
export const iframeMessagePool = ({
  iframeSrc
}) => {
  const eventQueue = createQueue();
  return {
    post: (type, data = {}) => {
      var _iframe$contentDocume;
      const iframe = getIframeFromDocumentQuery();
      const isNotLoaded = (iframe === null || iframe === void 0 || (_iframe$contentDocume = iframe.contentDocument) === null || _iframe$contentDocume === void 0 ? void 0 : _iframe$contentDocume.URL) === 'about:blank';
      if (!iframe || isNotLoaded) {
        eventQueue.enqueue({
          type,
          data
        });
      } else {
        postMessageToIframe({
          iframe,
          iframeSrc,
          type,
          data
        });
        executeAllIframeMessageQueueEvents({
          iframe,
          iframeSrc,
          eventQueue
        });
      }
    }
  };
};