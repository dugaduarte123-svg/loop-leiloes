const noop = () => {};
export const DEFAULT_LIFECYCLE_HOOKS = {
  onConnect: noop,
  onConnecting: noop,
  onDisconnect: noop,
  onFailure: noop,
  onSuspended: noop
};