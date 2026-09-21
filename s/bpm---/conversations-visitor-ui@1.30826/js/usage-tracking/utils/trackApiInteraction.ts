import { API_TRACKING_EVENT_NAMES } from '../../constants/apiTrackingEventNames';
import once from 'transmute/once';
import * as externalApiEventTypes from '../../external-api-events/constants/externalApiEventTypes';
import { trackApiEventListenerRegistered, trackApiMethodUsed, trackOnReadyUsed, trackSettingsUsed } from './trackMetric';
const trackOnReady = once(trackOnReadyUsed);
const trackSettings = once(trackSettingsUsed);
const hasTracked = new Set();
const trackableMethods = new Set(['load', 'refresh', 'open', 'close', 'remove', 'status', 'clear', 'updateEntryUrlMetadata']);
export const trackApiInteraction = (eventName, properties) => {
  if (!eventName || !properties || !API_TRACKING_EVENT_NAMES.includes(eventName)) {
    return;
  }
  if (eventName === 'HubspotConversations-hsConversationsOnReady-used') {
    trackOnReady();
  } else if (eventName === 'HubspotConversations-hsConversationsSettings-used') {
    trackSettings();
  } else if (eventName === 'HubspotConversations-api-method-used') {
    const {
      method
    } = properties;
    if (trackableMethods.has(method)) {
      trackableMethods.delete(method);
      trackApiMethodUsed(method);
    }
  } else if (eventName === 'HubspotConversations-api-event-listener-registered') {
    const event = properties.event;
    if (Object.values(externalApiEventTypes).includes(event) && !hasTracked.has(event)) {
      hasTracked.add(event);
      trackApiEventListenerRegistered(event);
    }
  }
};