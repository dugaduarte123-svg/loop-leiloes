// Stale or not, Success will *always* have data

/**
 * Produce an empty state. Used for clearing state and the hook's "skipped" scenario.
 *
 * Discards all values from the current state.
 *
 * @example
 * ```ts
 *
 * toEmpty()() = {
 *   data: undefined,
 *   error: null,
 *   loading: false,
 *   stale: false
 * }
 */
export const toEmpty = __state => () => ({
  data: undefined,
  error: null,
  loading: false,
  stale: false
});

/**
 * Produce a loading state. Forwards the current `data` if present and sets the stale flag accordingly.
 *
 * @example
 * ```ts
 *
 * const data = {
 *   data: 'foo',
 *   error: null,
 *   loading: false,
 *   stale: false
 * };
 *
 * toLoading()(data) = {
 *   data: 'foo', // Copies data
 *   error: null,
 *   loading: true, // Sets loading
 *   stale: true // Sets stale: true
 * }
 *
 * // Curried for use in conjunction with `withFunctionalNext` to automatically derive the correct state:
 *
 * runtime.next(toLoading())
 * ```
 */
export const toLoading = () => state => (state === null || state === void 0 ? void 0 : state.data) !== undefined ? {
  data: state.data,
  error: null,
  loading: true,
  stale: true
} : {
  data: undefined,
  error: null,
  loading: true,
  stale: false
};

/**
 * Produce a success state with the given data.
 *
 * @example
 * ```ts
 *
 * const data = { id: '1' };
 *
 * toSuccess(data)() = {
 *   data: { id: '1' },
 *   error: null,
 *   loading: false,
 *   stale: false
 * }
 *
 * // Curried for use in conjunction with `withFunctionalNext` to automatically derive the correct state:
 *
 * runtime.next(toSuccess(data))
 * ```
 */
export const toSuccess = nextData => () => ({
  data: nextData,
  error: null,
  loading: false,
  stale: false
});

/**
 * Produce an error state. Forwards the current `data` if present and sets the stale flag accordingly.
 *
 * @example
 * ```ts
 *
 * const state = {
 *   data: { id: '1' },
 *   error: null,
 *   loading: false,
 *   stale: false
 * };
 *
 * toError(new Error('Failed to fetch'))(state) = {
 *   data: { id: '1' },
 *   error: Error('Failed to fetch'),
 *   loading: false,
 *   stale: true
 * }
 *
 * // Curried for use in conjunction with `withFunctionalNext` to automatically derive the correct state:
 *
 * runtime.next(toError(new Error('Failed to fetch')))
 * ```
 */
export const toError = error => state => (state === null || state === void 0 ? void 0 : state.data) === undefined ? {
  data: undefined,
  error,
  loading: false,
  stale: false
} : {
  data: state.data,
  error,
  loading: false,
  stale: true
};

/**
 * Mark a state as stale if data is present.
 *
 * @example
 * ```ts
 *
 * const state = {
 *   data: { id: '1' },
 *   error: null,
 *   loading: false,
 *   stale: false
 * };
 *
 * markStale()(state) = {
 *   data: { id: '1' },
 *   error: null,
 *   loading: false,
 *   stale: true
 * }
 *
 * const noDataState = {
 *   error: null,
 *   loading: true,
 *   stale: false
 * };
 *
 * markStale()(noDataState) = {
 *   error: null,
 *   loading: true,
 *   stale: false
 * };
 *
 * // Curried for use in conjunction with `withFunctionalNext` to automatically derive the correct state:
 *
 * runtime.next(markStale())
 * ```
 */
export const markStale = () => state => state.data === undefined ? Object.assign({}, state) : Object.assign({}, state, {
  data: state.data,
  stale: true
});

/**
 * Merge source state flags (loading, error, stale) with target data,
 * ensuring the result satisfies ResolverState type constraints.
 *
 * This helper safely combines state flags from one resource with data from another,
 *
 * Primarily used in link transforms when inheriting parent state with derived child data.
 */
export const applyState = (sourceState, targetState) => {
  // If source is loading, we're loading.
  if (sourceState.loading) {
    return toLoading()(targetState);
  }

  // If source is in error state, copy the error over
  if (sourceState.error) {
    return toError(sourceState.error)(targetState);
  }
  if ((targetState === null || targetState === void 0 ? void 0 : targetState.data) !== undefined) {
    const successState = toSuccess(targetState.data)();
    if (sourceState.stale) {
      return markStale()(successState);
    }
    return successState;
  }
};