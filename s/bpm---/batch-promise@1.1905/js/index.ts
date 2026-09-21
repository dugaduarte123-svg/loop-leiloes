import { createBatchScheduler } from './batchScheduler';
/**
 * A fluent builder that creates a batch scheduler.
 *
 * The scheduler provides an interface to queue "calls" that can be partitioned
 * into batches, which are then dispatched with various timing strategies.
 *
 * @example
 * ```typescript
 * // Read mode - optimized for data fetching with deduplication
 * const userReader = scheduler
 *   .read<{ userId: number }>()
 *   .identity(({ userId }) => userId.toString())
 *   .partition(() => 'users')
 *   .execute(fetchUsersBatch)
 *   .extract((batchResponse, { userId }) => batchResponse.users[userId])
 *   .debounce(100);
 *
 *
 * const user1 = await userReader.queue({ userId: 123 });
 *
 * // Write mode - optimized for data updates with last-write-wins
 * const userWriter = scheduler
 *   .write<{ userId: number, name: string }>()
 *   .identity(({ userId }) => userId.toString())
 *   .partition(() => 'users')
 *   .execute(saveUsersBatch)
 *   .extract((batchResponse, { userId }) => batchResponse.users[userId])
 *   .debounce(500);
 *
 * // Both will resolve at the same time to the result of write2
 * const write1 = userWriter.queue({ userId: 123, name: 'Alice' });
 * const write2 = userWriter.queue({ userId: 123, name: 'Bob' });
 *
 * write1 === write2; // true — both variables reference the same promise
 *
 * ```
 */
export const batchScheduler = () => {
  const createBuilder = mode => ({
    /**
     * Specify the identity function that will be used to deduplicate calls. Will be passed a call input
     * and is expected to return a string uniquely identifying that call.
     *
     * Note: This identity key must be globally unique — it is **not** namespaced by partition.
     */
    identity: identityFn => ({
      /**
       * Specify the partition function that will be used to group calls into a batch.
       *
       * A "batch" is a set of calls that will be fulfilled by a single underlying promise,
       * e.g a group of objects that can be fulfilled by a single http request.
       */
      partition: partitionFn => ({
        /**
         * Specify the execute function that fulfills a batch. Will be provided
         * a map of call identity > input and is expected to turn those inputs into a result.
         */
        execute: executeFn => ({
          /**
           * Specify the extraction function that is provided a single call input + identity
           * and is expected to extract the result for that call from the resolved (if a Promise) result
           * of the execute function.
           */
          extract: extractFn => {
            const timingChain = chunkSize => {
              const common = {
                identity: identityFn,
                partition: partitionFn,
                execute: executeFn,
                extract: extractFn,
                chunkSize,
                mode
              };
              return {
                /**
                 * Create an immediate mode scheduler which batches calls only within this tick of the event loop (zero-tick batching).
                 */
                immediate: () => createBatchScheduler(Object.assign({}, common, {
                  type: 'immediate'
                })),
                /**
                 * Create a debouncing scheduler which waits until calls to a partition have been quiet for `debounceMs` millis before
                 * dispatching a batch.
                 */
                debounce: (debounceMs, maxWaitMs) => {
                  if (debounceMs < 0) {
                    throw Error('Invalid debounceMs: Must be greater than or equal to zero');
                  }
                  if (maxWaitMs && maxWaitMs < 0) {
                    throw Error('Invalid maxWaitMs: Must be greater than or equal to zero');
                  }
                  if (maxWaitMs && maxWaitMs <= debounceMs) {
                    throw Error('Invalid maxWaitMs: Must be greater than debounceMs');
                  }
                  return createBatchScheduler(Object.assign({}, common, {
                    type: 'debounce',
                    timeMs: debounceMs,
                    maxWaitMs
                  }));
                },
                /**
                 * Create a windowed scheduler collects calls for `windowMs` millis then dispatches.
                 */
                window: windowMs => {
                  if (windowMs < 0) {
                    throw Error('Invalid windowMs: Must be greater than or equal to zero');
                  }
                  return createBatchScheduler(Object.assign({}, common, {
                    type: 'window',
                    timeMs: windowMs
                  }));
                }
              };
            };
            return Object.assign({
              /**
               * Set the chunk size - batches will be dispatched immediately when this many calls are queued.
               *
               * Must be a positive integer.
               */
              chunkSize: size => {
                if (!Number.isInteger(size) || size <= 0) {
                  throw Error('Invalid chunkSize: Must be a positive integer');
                }
                return timingChain(size);
              }
            }, timingChain(Number.POSITIVE_INFINITY));
          }
        })
      })
    })
  });
  return {
    /**
     * Create a read-optimized scheduler with first-write-wins deduplication that will
     * dedupe against dispatched calls.
     *
     * Ideal for data fetching where you want to minimize redundant requests.
     */
    read: () => createBuilder('read'),
    /**
     * Create a write-optimized scheduler with last-write-wins deduplication that will
     * not dedupe against dispatched calls.
     *
     * Ideal for data updates where the latest user input should take precedence, but once dispatched,
     * the scheduler will create a new batch for the same identity.
     */
    write: () => createBuilder('write')
  };
};