/**
 * A small helper that enables a functional updater form of next() (passing state objects directly is still allowed).
 *
 * Use is opt-in, but recommended if handling the standard state transitions. The
 * curried utilities exported from resolverState are built to work with this pattern.
 *
 * Returning the same state reference will no-op the update. Returning nothing (void) will also no-op.
 *
 * @example
 * ```ts
 * const resolver = {
 *   name: 'test',
 *   attach: (params, runtime) => {
 *     const next = makeFunctionalNext(runtime);
 *
 *     next(currentState => ({
 *       ...currentState,
 *       data: { result: 1 },
 *     }));
 *
 *     // or
 *
 *     next(toSuccess({ result: 1 }));
 *
 *     // or
 *
 *     next(current => {
 *       if (!current) {
 *         return; // void return to no-op
 *       }
 *
 *       // do something interesting!
 *     })
 *   }),
 * };
 * ```
 */
export const makeFunctionalNext = runtime => state => {
  const nextState = typeof state === 'function' ? state(runtime.getState()) : state;
  if (nextState) {
    runtime.next(nextState);
  }
};