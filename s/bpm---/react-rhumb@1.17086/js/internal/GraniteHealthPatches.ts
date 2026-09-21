const STATE_KEY = '__hs_granite_health__';
const PATCHED_KEY = '__hs_granite_health_patched__';
function getState() {
  const win = window;
  if (!win[STATE_KEY]) {
    win[STATE_KEY] = {
      listenerCount: 0,
      timerCount: 0,
      observerCount: 0,
      transitionCount: 0,
      activeTimerIds: new Set(),
      previousSnapshot: null,
      appDeltas: [],
      thresholdFired: false
    };
  }
  return win[STATE_KEY];
}
export function getCounts() {
  const {
    listenerCount,
    timerCount,
    observerCount,
    transitionCount
  } = getState();
  return {
    listenerCount,
    timerCount,
    observerCount,
    transitionCount
  };
}
export function incrementTransitionCount() {
  getState().transitionCount++;
}
export function getPreviousSnapshot() {
  var _getState$previousSna;
  return (_getState$previousSna = getState().previousSnapshot) !== null && _getState$previousSna !== void 0 ? _getState$previousSna : null;
}
export function saveSnapshot(snapshot) {
  getState().previousSnapshot = snapshot;
}
export function accumulateDelta(appName, delta) {
  const state = getState();
  if (!state.appDeltas) {
    state.appDeltas = [];
  }
  state.appDeltas.push(Object.assign({
    appName
  }, delta));
}
export function getAllDeltas() {
  var _getState$appDeltas;
  return (_getState$appDeltas = getState().appDeltas) !== null && _getState$appDeltas !== void 0 ? _getState$appDeltas : [];
}
export function hasThresholdFired() {
  var _getState$thresholdFi;
  return (_getState$thresholdFi = getState().thresholdFired) !== null && _getState$thresholdFi !== void 0 ? _getState$thresholdFi : false;
}
export function markThresholdFired() {
  getState().thresholdFired = true;
}
export function installGraniteHealthPatches() {
  const win = window;
  if (win[PATCHED_KEY]) {
    return;
  }
  win[PATCHED_KEY] = true;
  patchEventListeners();
  patchTimers();
  patchObserver('MutationObserver');
  patchObserver('IntersectionObserver');
  patchObserver('ResizeObserver');
  patchObserver('PerformanceObserver');
}
function patchEventListeners() {
  const origAdd = EventTarget.prototype.addEventListener;
  const origRemove = EventTarget.prototype.removeEventListener;

  // listenerCount is a best-effort approximation. The browser silently
  // deduplicates same-triple addEventListener calls and silently no-ops
  // removeEventListener for unregistered listeners; we can't detect either
  // without a per-target registry.
  EventTarget.prototype.addEventListener = function (type, listener, options) {
    getState().listenerCount++;
    return origAdd.call(this, type, listener, options);
  };
  EventTarget.prototype.removeEventListener = function (type, listener, options) {
    const state = getState();
    if (state.listenerCount > 0) {
      state.listenerCount--;
    }
    return origRemove.call(this, type, listener, options);
  };
}
function patchTimers() {
  const origSetInterval = window.setInterval.bind(window);
  const origClearInterval = window.clearInterval.bind(window);
  const origSetTimeout = window.setTimeout.bind(window);
  const origClearTimeout = window.clearTimeout.bind(window);
  window.setInterval = function (handler, timeout, ...args) {
    const id = origSetInterval(handler, timeout, ...args);
    const state = getState();
    state.timerCount++;
    state.activeTimerIds.add(id);
    return id;
  };
  window.clearInterval = function (id) {
    if (id !== undefined) {
      const state = getState();
      if (state.activeTimerIds.has(id)) {
        state.activeTimerIds.delete(id);
        state.timerCount--;
      }
    }
    origClearInterval(id);
  };
  window.setTimeout = function (handler, timeout, ...args) {
    // String handlers can't be wrapped to decrement on fire; skip counting them.
    if (typeof handler !== 'function') {
      return origSetTimeout(handler, timeout, ...args);
    }
    const idRef = {
      current: 0
    };
    const wrappedHandler = (...cbArgs) => {
      const state = getState();
      if (state.activeTimerIds.has(idRef.current)) {
        state.activeTimerIds.delete(idRef.current);
        state.timerCount--;
      }
      handler(...cbArgs);
    };
    idRef.current = origSetTimeout(wrappedHandler, timeout, ...args);
    const state = getState();
    state.timerCount++;
    state.activeTimerIds.add(idRef.current);
    return idRef.current;
  };
  window.clearTimeout = function (id) {
    if (id !== undefined) {
      const state = getState();
      if (state.activeTimerIds.has(id)) {
        state.activeTimerIds.delete(id);
        state.timerCount--;
      }
    }
    origClearTimeout(id);
  };
}
function patchObserver(name) {
  const Original = window[name];
  if (!Original) {
    return;
  }
  const Patched = class extends Original {
    constructor(...args) {
      super(...args);
      getState().observerCount++;
    }
    disconnect() {
      const state = getState();
      if (state.observerCount > 0) {
        state.observerCount--;
      }
      super.disconnect();
    }
  };
  Object.defineProperty(Patched, 'name', {
    value: name
  });
  window[name] = Patched;
}