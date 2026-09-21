// From hub-http
const EVENT_NAMESPACE = 'hubspot:messages:';
export function triggerEvent(eventName, data) {
  let event;
  const namespacedName = `${EVENT_NAMESPACE}${eventName}`;
  if (typeof window.Event === 'function') {
    event = Object.assign(new Event(namespacedName), data);
  } else {
    event = Object.assign(document.createEvent('Event'), data);
    event.initEvent(namespacedName, true, true);
  }
  window.dispatchEvent(event);
}
export const EVENTS = {
  messagesInitialized: ({
    messageWillRender,
    reason
  }) => {
    triggerEvent('initialized', {
      messageWillRender,
      reason
    });
  }
};