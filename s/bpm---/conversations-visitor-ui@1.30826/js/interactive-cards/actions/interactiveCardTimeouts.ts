const pendingTimeouts = new Map();
export function registerPendingActionTimeout(cardInstanceId, onTimeout, ms) {
  cancelPendingActionTimeout(cardInstanceId);
  pendingTimeouts.set(cardInstanceId, setTimeout(() => {
    pendingTimeouts.delete(cardInstanceId);
    onTimeout();
  }, ms));
}
export function cancelPendingActionTimeout(cardInstanceId) {
  const id = pendingTimeouts.get(cardInstanceId);
  if (id !== undefined) {
    clearTimeout(id);
    pendingTimeouts.delete(cardInstanceId);
  }
}
export function cancelAllPendingTimeouts() {
  pendingTimeouts.forEach(id => clearTimeout(id));
  pendingTimeouts.clear();
}