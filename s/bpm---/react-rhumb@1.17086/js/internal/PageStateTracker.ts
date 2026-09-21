/**
 * Tracks state changes to help identify long tasks that occur
 * when the page is in the background or offline.
 *
 * This singleton tracks:
 * - navigator.onLine: Network connectivity status
 * - document.hidden: Whether the document is visible or in background
 */
class PageStateTracker {
  constructor() {
    this.stateChanges = [];
    this.maxStateChanges = 100;
    this.listeners = [];
    this.currentState = {
      online: navigator.onLine,
      hidden: document.hidden
    };

    // Record the initial state so we have a baseline
    this.recordStateChange();
    this.initializeListeners();
  }
  static getInstance() {
    if (!PageStateTracker.instance) {
      PageStateTracker.instance = new PageStateTracker();
    }
    return PageStateTracker.instance;
  }

  /**
   * Get the current page state snapshot
   */
  getSnapshot() {
    return Object.assign({}, this.currentState, {
      stateChanges: [...this.stateChanges]
    });
  }

  /**
   * Get summary of page state since the beginning of the session
   * Returns whether the page was ever hidden or offline
   */
  getStateSummary() {
    // Check if page was ever hidden/offline since the beginning of the session
    const wasEverHidden = this.stateChanges.some(change => change.hidden);
    const wasEverOffline = this.stateChanges.some(change => !change.online);
    return {
      wasEverHidden,
      wasEverOffline
    };
  }

  /**
   * Reset the tracker (mainly for testing)
   */
  reset() {
    this.stateChanges = [];
    this.currentState = {
      online: navigator.onLine,
      hidden: document.hidden
    };
    this.recordStateChange();
  }

  /**
   * Destroy the singleton instance (for testing only)
   */
  static __destroyInstance() {
    if (PageStateTracker.instance) {
      PageStateTracker.instance.cleanupListeners();
    }
    // @ts-ignore - Setting to undefined for testing purposes
    PageStateTracker.instance = undefined;
  }
  recordStateChange() {
    const change = Object.assign({
      timestamp: performance.now()
    }, this.currentState);
    this.stateChanges.push(change);
    if (this.stateChanges.length > this.maxStateChanges) {
      this.stateChanges.shift();
    }
  }
  initializeListeners() {
    const onlineHandler = () => {
      this.currentState.online = true;
      this.recordStateChange();
    };
    const offlineHandler = () => {
      this.currentState.online = false;
      this.recordStateChange();
    };
    const visibilityHandler = () => {
      this.currentState.hidden = document.hidden;
      this.recordStateChange();
    };
    window.addEventListener('online', onlineHandler);
    window.addEventListener('offline', offlineHandler);
    document.addEventListener('visibilitychange', visibilityHandler);
    this.listeners.push({
      target: window,
      type: 'online',
      handler: onlineHandler
    }, {
      target: window,
      type: 'offline',
      handler: offlineHandler
    }, {
      target: document,
      type: 'visibilitychange',
      handler: visibilityHandler
    });
  }
  cleanupListeners() {
    this.listeners.forEach(({
      target,
      type,
      handler
    }) => {
      target.removeEventListener(type, handler);
    });
    this.listeners = [];
  }
}
export default PageStateTracker;