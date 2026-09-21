import { maybeQueueMicrotask } from './maybeQueueMicrotask';
import { withResolvers } from './withResolvers';

// Core function types

// Internal data structures

// Batch configuration types

/**
 * Smart promise batching with configurable timing strategies and deduplication semantics.
 *
 * Collects and dispatches batches of calls according to the configured timing strategy.
 * Promises are intelligently reused when duplicates are detected based on identity.
 *
 * Error handling:
 * - Batch execution errors reject all calls in that batch
 * - Individual extraction errors only reject that specific call
 * - Concurrent batches are isolated - errors don't cascade
 *
 * Deduplication behavior depends on mode:
 * - Read mode: First-write-wins, dedupes across both pending and dispatched (in-flight) calls
 * - Write mode: Last-write-wins, only dedupes pending calls (creates new batch after dispatch)
 */

/**
 * Read-mode batch scheduler with aggressive deduplication.
 *
 * Deduplication strategy:
 * - First-write-wins: Duplicate calls return the same promise
 * - Dedupes against both pending AND dispatched (in-flight) requests
 * - Perfect for data fetching where multiple calls for the same resource should collapse
 *
 * Edge cases:
 * - Subsequent calls with same identity but different partition will dedupe into the original partition
 */

/**
 * Write-mode batch scheduler with last-write-wins semantics.
 *
 * Deduplication strategy:
 * - Last-write-wins: Latest data takes precedence for pending calls
 * - Only dedupes pending calls (not dispatched - creates new batch instead)
 * - Perfect for updates where the most recent value matters
 *
 * Edge cases:
 * - Subsequent calls with same identity but different partition will dedupe into the new partition
 */

export const createBatchScheduler = configInput => {
  // Clone & freeze config to prevent bugs from mutation
  const config = Object.freeze(Object.assign({}, configInput));

  // Track all current batches, tracking calls that will be fulfilled with a single request with their timing controls
  const batches = new Map();

  // Track all pending calls (those whose underlying request hasn't yet been dispatched)
  const pendingCalls = new Map();

  // Track all dispatched calls (those whose request has been dispatched and are awaiting a response)
  const dispatchedCalls = new Map();
  const takeBatch = partition => {
    const batchData = batches.get(partition);
    batches.delete(partition);
    clearTimeout(batchData === null || batchData === void 0 ? void 0 : batchData.timeoutId);
    clearTimeout(batchData === null || batchData === void 0 ? void 0 : batchData.maxTimeoutId);
    return batchData;
  };

  // Execute a batch of calls for a given partition
  const executeBatch = async partition => {
    const batchData = takeBatch(partition);

    // If the batch is empty, we can just return
    if (!batchData || batchData.calls.size === 0) {
      return;
    }

    // Get call data from pendingCalls, copy into dispatched
    const callsData = [];
    for (const identityKey of batchData.calls) {
      const callData = pendingCalls.get(identityKey);
      if (callData) {
        callsData.push(callData);
        dispatchedCalls.set(identityKey, callData);
        pendingCalls.delete(identityKey);
      }
    }
    try {
      // Build execute parameter
      const batch = {};
      for (const {
        identityKey,
        input
      } of callsData) {
        batch[identityKey] = input;
      }

      // Execute this batch
      const response = await config.execute(batch, partition);
      for (const {
        identityKey,
        input,
        resolve,
        reject
      } of callsData) {
        try {
          resolve(config.extract({
            response,
            input,
            identity: identityKey
          }));
        } catch (error) {
          // Reject individual calls if extraction rejects
          reject(error);
        }
        dispatchedCalls.delete(identityKey);
      }
    } catch (error) {
      // Reject entire batch if request fails
      for (const {
        identityKey,
        reject
      } of callsData) {
        reject(error);
        dispatchedCalls.delete(identityKey);
      }
    }
  };
  const queueUnsafe = input => {
    var _pendingCalls$get, _batches$get;
    const identityKey = config.identity(input);
    const partition = config.partition(input);

    // Check for duplicates
    if (config.mode === 'read') {
      const existingCallData = pendingCalls.get(identityKey) || dispatchedCalls.get(identityKey);
      if (existingCallData) {
        return existingCallData.promise;
      }
    } else if (config.mode === 'write') {
      // Only dedupe pending calls in write mode
      const existingCallData = pendingCalls.get(identityKey);
      if (existingCallData) {
        const oldPartition = existingCallData.partition;

        // Update the existing call's input and partition (last-write-wins)
        existingCallData.input = input;
        existingCallData.partition = partition;

        // If same partition, we're done and can return the existing promise
        if (oldPartition === partition) {
          return existingCallData.promise;
        }

        // Otherwise, we're switching partitions
        const oldBatchData = batches.get(oldPartition);
        if (oldBatchData) {
          // Remove the call from the old partition
          oldBatchData.calls.delete(identityKey);

          // If the old partition is now empty, clean it up
          if (oldBatchData.calls.size === 0) {
            takeBatch(oldPartition);
          }
        }

        // Fall through to add to new partition
      }
    }

    // If we get here with a value in pendingCalls, we need to reuse it (only relevant when switching batches in write mode).
    // Otherwise, we need to create a new promise.
    const {
      promise,
      resolve,
      reject
    } = (_pendingCalls$get = pendingCalls.get(identityKey)) !== null && _pendingCalls$get !== void 0 ? _pendingCalls$get : withResolvers();
    const callData = {
      identityKey,
      promise,
      input,
      partition,
      resolve,
      reject
    };
    pendingCalls.set(identityKey, callData);

    // Add identity to batch
    const batchData = (_batches$get = batches.get(partition)) !== null && _batches$get !== void 0 ? _batches$get : {
      calls: new Set()
    };
    batchData.calls.add(identityKey);
    batches.set(partition, batchData);

    // Execute the batch immediately if we've reached or somehow surpassed the chunk size
    if (batchData.calls.size >= config.chunkSize) {
      void executeBatch(partition);
      return promise;
    }
    if (config.type === 'debounce') {
      // If debouncing, clear and re-set the timeout
      if (batchData.timeoutId) {
        clearTimeout(batchData.timeoutId);
      }
      batchData.timeoutId = setTimeout(() => executeBatch(partition), config.timeMs);

      // Set a max timeout
      if (config.maxWaitMs && !batchData.maxTimeoutId) {
        batchData.maxTimeoutId = setTimeout(() => executeBatch(partition), config.maxWaitMs);
      }
    } else if (config.type === 'window') {
      // If windowing, set the timeout if it doesn't already exist
      if (!batchData.timeoutId) {
        batchData.timeoutId = setTimeout(() => executeBatch(partition), config.timeMs);
      }
    } else if (config.type === 'immediate') {
      // If immediate, queue a microtask to execute the batch
      if (!batchData.microtaskScheduled) {
        batchData.microtaskScheduled = true;
        maybeQueueMicrotask(() => void executeBatch(partition));
      }
    }
    return promise;
  };

  /**
   * Queue a call in the batch scheduler.
   *
   * Returns a promise that will resolve to the result of the call.
   */
  const queue = input => {
    try {
      return queueUnsafe(input);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Abort all pending calls. Primarily intended for cleaning up between test specs.
   *
   * Note: In-flight batches may still complete and could affect deduping
   * of identical calls dispatched after abort.
   */
  const abort = () => {
    // Clear all timeouts
    for (const partition of batches.keys()) {
      takeBatch(partition);
    }

    // Reject all external promises
    for (const callData of [...pendingCalls.values(), ...dispatchedCalls.values()]) {
      callData.reject(Error('Cancelled'));
    }

    // Clear all maps
    batches.clear();
    pendingCalls.clear();
    dispatchedCalls.clear();
  };

  /**
   * Flush all pending batches. This is a cleaner version of abort that immediately dispatches any pending calls
   * then waits on all dispatched calls to settle.
   *
   * Note: rejections will be swallowed here (i.e flush always resolves), but are still surfaced to the queuer.
   */
  const flush = async () => {
    // Execute all pending batches immediately.
    // executeBatch is async but runs synchronously up to `await config.execute(...)`.
    // For sync execute functions, this means the callback fires synchronously here.
    for (const partitionKey of batches.keys()) {
      void executeBatch(partitionKey);
    }
    const allPromises = [...dispatchedCalls.values()].map(callData => callData.promise);

    // Wait for all dispatched calls to complete
    await Promise.allSettled(allPromises);
  };

  // Ensure we don't lose type checking
  const scheduler = {
    queue,
    abort,
    flush,
    identity: config.identity,
    partition: config.partition
  };

  // Assert as the correct "mode" (uses branded types to differentiate)
  return scheduler;
};