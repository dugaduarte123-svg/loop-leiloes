/**
 * A builder interface that allows for easy decorator chaining
 * with proper type inference for decorator param extension.
 *
 * @example
 * ```ts
 * const resolver = decorate(baseResolver)
 *   .with(polling({ intervalMs: 1000 }))
 *   .with(lifecycleRules);
 * ```
 */
export const decorate = resolver => Object.freeze(Object.assign({}, resolver, {
  with: decorator => decorate(decorator(resolver)),
  when: (predicate, decorator) => {
    const decorated = decorator(resolver);
    const addedTags = decorated.tags.filter(t => !resolver.tags.includes(t));
    return decorate({
      name: resolver.name,
      tags: [...resolver.tags, ...addedTags.map(t => `when(${t})`)],
      attach: (params, runtime) => {
        if (predicate(params)) {
          return decorated.attach(params, runtime);
        }
        return resolver.attach(params, runtime);
      }
    });
  }
}));

// A helper type to strip NoParams if a decorator is extending a no-param resolver

// A decorator that doesn't extend params

// A decorator that extends params

/**
 * Create a decorator that wraps a resolver with additional behavior and/or params.
 *
 * Handles a few invariants:
 * - Preserves underlying resolver's name
 * - Adds decorator's name to list of tags
 * - Passes base + added (if defined) params separately to make TS happy
 *
 * @example
 * ```ts
 * // Simple case
 * const polling = (pollIntervalMs: number) => createDecorator(
 *   'polling',
 *   (attach) => (baseParams, runtime) => {
 *     const baseHandle = attach(baseParams, runtime);
 *
 *     // polling logic, return handle
 *   }
 * );
 *
 * // Param extension
 * const envAwareHttpClient = createDecorator<{ env: 'qa' | 'prod' }>(
 *  'withEnv',
 *  (attach) =>
 *    (baseParams, runtime, addedParams) =>
 *      attach(baseParams, {
 *        ...runtime,
 *         env: {
 *          ...runtime.env,
 *          httpClient: addedParams.env === 'qa'
 *            ? ({} as ResolverHttpClient)
 *            : runtime.env.httpClient,
 *         },
 *      })
 * );
 * ```
 */
export function createDecorator(name, wrapAttach) {
  return resolver => {
    const wrappedAttach = wrapAttach(resolver.attach);
    return {
      name: resolver.name,
      tags: [...resolver.tags, name],
      attach: (fullParams, runtime) => wrappedAttach(fullParams, runtime, fullParams)
    };
  };
}