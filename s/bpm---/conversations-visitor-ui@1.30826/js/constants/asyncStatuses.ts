export const ASYNC_STATUS = {
  UNINITIALIZED: 'UNINITIALIZED',
  STARTED: 'STARTED',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED'
};
export const uninitialized = data => ({
  data,
  status: ASYNC_STATUS.UNINITIALIZED
});
export const started = data => ({
  data,
  status: ASYNC_STATUS.STARTED
});
export const succeeded = data => ({
  data,
  status: ASYNC_STATUS.SUCCEEDED
});
export const failed = (data, error) => Object.assign({
  data,
  status: ASYNC_STATUS.FAILED
}, error !== undefined && {
  error
});
export const getData = state => state === null || state === void 0 ? void 0 : state.data;
export const getError = state => state === null || state === void 0 ? void 0 : state.error;
export const getStatus = state => state === null || state === void 0 ? void 0 : state.status;

// Uses { status?: string } for interop with external AsyncData Immutable Records
// from conversations-internal-pub-sub (subscriptions, pubSubClient). Can be tightened
// to AsyncState<unknown> if that library migrates off conversations-async-data.
export const isSucceeded = state => (state === null || state === void 0 ? void 0 : state.status) === ASYNC_STATUS.SUCCEEDED;
export const isFailed = state => (state === null || state === void 0 ? void 0 : state.status) === ASYNC_STATUS.FAILED;
export const isStarted = state => (state === null || state === void 0 ? void 0 : state.status) === ASYNC_STATUS.STARTED;
export const isUninitialized = state => (state === null || state === void 0 ? void 0 : state.status) === ASYNC_STATUS.UNINITIALIZED;