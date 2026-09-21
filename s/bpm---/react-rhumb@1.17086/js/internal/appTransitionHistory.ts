import { getReferrer } from './browserAccessors';
import { isReload } from './navigation';
const SESSION_STORAGE_KEY = 'rhumb_transition_history';
const MAX_HISTORY_SIZE = 20;
/**
 * Get the transition history from session storage
 */
function getTransitionHistory() {
  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) {
      return {
        events: []
      };
    }
    return JSON.parse(stored);
  } catch (error) {
    // Invalid JSON or other error - return empty history
    return {
      events: []
    };
  }
}

/**
 * Save the transition history to session storage
 */
function saveTransitionHistory(history) {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    // SessionStorage full or unavailable - silently fail
    console.warn('[react-rhumb] Failed to save transition history', error);
  }
}

/**
 * Push an event onto the transition history stack with size limiting
 */
function pushEvent(event) {
  const history = getTransitionHistory();
  history.events.push(event);
  if (history.events.length > MAX_HISTORY_SIZE) {
    history.events = history.events.slice(-MAX_HISTORY_SIZE);
  }
  saveTransitionHistory(history);
}

/**
 * Push an APP_UNLOAD event onto the transition history stack
 */
export function pushAppUnload(appName, appVersion, url) {
  pushEvent({
    type: 'APP_UNLOAD',
    appName,
    appVersion,
    timestamp: Date.now(),
    url
  });
}

/**
 * Get the most recent APP_UNLOAD event from the stack
 */
export function getMostRecentAppUnload() {
  const history = getTransitionHistory();
  const appUnloadEvents = history.events.filter(e => e.type === 'APP_UNLOAD');
  if (appUnloadEvents.length === 0) {
    return null;
  }
  return appUnloadEvents[appUnloadEvents.length - 1];
}

/**
 * Check if this tab was opened as a new tab (via window.open or target="_blank").
 * Returns true if we find a NEW_TAB_OPENING event without a matching NEW_TAB_OPENED.
 *
 * When a new tab is opened:
 * 1. Parent pushes NEW_TAB_OPENING
 * 2. New tab is created (inherits storage with NEW_TAB_OPENING)
 * 3. Parent pushes NEW_TAB_OPENED (new tab doesn't get this)
 *
 * So: NEW_TAB_OPENING without NEW_TAB_OPENED = we're in the new tab
 */
function wasOpenedAsNewTab() {
  const history = getTransitionHistory();
  const events = history.events;

  // Walk backwards to find the most recent NEW_TAB_OPENING
  for (let i = events.length - 1; i >= 0; i--) {
    const event = events[i];
    if (event.type === 'NEW_TAB_OPENED') {
      // Found a complete pair, this tab opened a new tab but we're still in parent
      return false;
    }
    if (event.type === 'NEW_TAB_OPENING') {
      // Found opening without matching opened - we're in the new tab
      return true;
    }
  }
  return false;
}

/**
 * Check if the current page load is a transition from another HubSpot app.
 * Returns the referrer app name if it's a valid transition, null otherwise.
 */
export function maybeGetReferrerApp(softNavigationContext) {
  if (softNavigationContext) {
    return softNavigationContext.fromRemoteApp;
  }
  if (wasOpenedAsNewTab()) {
    return null;
  }
  if (isReload()) {
    return 'refresh';
  }
  const referrer = getReferrer();
  if (!referrer) {
    return null;
  }
  const history = getTransitionHistory();
  const appUnloadEvents = history.events.filter(e => e.type === 'APP_UNLOAD');
  if (appUnloadEvents.length === 0) {
    return null;
  }
  let referrerUrl = null;
  try {
    referrerUrl = new URL(referrer);
  } catch (error) {
    return null;
  }
  for (let i = appUnloadEvents.length - 1; i >= 0; i--) {
    const unload = appUnloadEvents[i];
    if (referrer === unload.url) {
      return unload.appName;
    }
    try {
      const unloadUrl = new URL(unload.url);
      if (referrerUrl.origin === unloadUrl.origin && referrerUrl.pathname === unloadUrl.pathname) {
        return unload.appName;
      }
    } catch (error) {
      // skip
    }
  }
  return null;
}

/**
 * Push a NEW_TAB_OPENING event to mark that a new tab is about to be opened.
 * This is called right before window.open or target="_blank" navigation so the
 * new tab (which inherits sessionStorage) knows it wasn't a same-tab transition.
 */
export function pushNewTabOpening() {
  pushEvent({
    type: 'NEW_TAB_OPENING',
    timestamp: Date.now()
  });
}

/**
 * Push a NEW_TAB_OPENED event to mark that the new tab has been created.
 * Called in the parent tab after the new tab is opened.
 * The new tab won't have this event (it inherited storage before this was pushed).
 */
export function pushNewTabOpened() {
  pushEvent({
    type: 'NEW_TAB_OPENED',
    timestamp: Date.now()
  });
}

/**
 * Clear the transition history (useful for testing or manual cleanup)
 */
export function clearTransitionHistory() {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    // Silently fail
  }
}