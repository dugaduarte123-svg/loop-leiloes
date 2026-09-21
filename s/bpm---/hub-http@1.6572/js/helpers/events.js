'use es6';

// make sure we support IE11 when triggering events
export const triggerEvent = (eventName, data) => {
    let event;
    if (typeof window.Event === 'function') {
        event = Object.assign(new Event(eventName), data);
    } else {
        event = Object.assign(document.createEvent('Event'), data);
        event.initEvent(eventName, true, true);
    }
    window.dispatchEvent(event);
};