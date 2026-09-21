import { TRACK_API_USAGE } from '../iframe-communication/constants/sentPostMessageTypes';
export class ApiUsageTracker {
  constructor({
    postMessageToIframe
  }) {
    if (typeof postMessageToIframe !== 'function') {
      throw new TypeError('ApiUsageTracker: postMessageToIframe was not a function');
    }
    this._postMessageToIframe = postMessageToIframe;
    this.sendEventToTracker = this.sendEventToTracker.bind(this);
    this.trackSettingsUsed = this.trackSettingsUsed.bind(this);
    this.trackMethod = this.trackMethod.bind(this);
    this.trackEventListener = this.trackEventListener.bind(this);
    this.trackOnReady = this.trackOnReady.bind(this);
  }
  sendEventToTracker(eventName, properties = {}) {
    this._postMessageToIframe(TRACK_API_USAGE, {
      eventName,
      properties
    });
  }
  trackSettingsUsed(externalApiSettings) {
    const settingsUsed = {};
    if (externalApiSettings.loadImmediately === false) {
      settingsUsed.loadImmediately = true;
    }
    if (externalApiSettings.inlineEmbedSelector) {
      settingsUsed.inlineEmbedSelector = true;
    }
    if (externalApiSettings.enableWidgetCookieBanner) {
      settingsUsed.enableWidgetCookieBanner = true;
    }
    if (externalApiSettings.disableAttachment) {
      settingsUsed.disableAttachment = true;
    }
    if (externalApiSettings.disableInitialInputFocus) {
      settingsUsed.disableInitialInputFocus = true;
    }
    if (Object.keys(settingsUsed).length > 0) {
      this.sendEventToTracker('HubspotConversations-hsConversationsSettings-used', settingsUsed);
    }
  }
  trackMethod(methodName) {
    this.sendEventToTracker('HubspotConversations-api-method-used', {
      method: methodName
    });
  }
  trackEventListener(eventName) {
    this.sendEventToTracker(`HubspotConversations-api-event-listener-registered`, {
      event: eventName
    });
  }
  trackOnReady() {
    this.sendEventToTracker('HubspotConversations-hsConversationsOnReady-used', {
      method: 'hsConversationsOnReady'
    });
  }
}