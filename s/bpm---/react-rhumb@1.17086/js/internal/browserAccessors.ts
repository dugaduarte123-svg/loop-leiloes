export function getReferrer() {
  return document.referrer;
}
export function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (_unused) {
    return true;
  }
}
export function getSessionId() {
  return window.hubspot && window.hubspot.sessionId;
}