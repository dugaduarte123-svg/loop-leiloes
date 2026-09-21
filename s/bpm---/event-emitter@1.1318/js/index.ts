/**
 * Create a typed event emitter.
 *
 * To type events, provide a type that maps event type name > event data.
 *
 * Set the data's type to `void` or `undefined` to define an empty event.
 *
 * Set the key to a string to allow arbitrary string types that map to a specific
 * event shape.
 *
 * @param opts - The options for the event emitter
 * @param opts.onEmitError - Optional callback for error handling
 * @returns The event emitter with methods:
 * - `.count(type)` to count event subscribers (does not count wildcard subscribers)
 * - `.on(type, callback: (data, off))` to subscribe to an event
 * - `.all({ type, data }, off)` to subscribe to all events (a "wildcard subscriber")
 * - `.emit(type, data)` to emit an event
 * - `.teardown()` to cleanup the emitter
 *
 * @example
 * ```typescript
 * // Simple event type
 * const emitter = create<{ 'test-type': string }>();
 *
 * emitter.on('test-type', (data) => {
 *   console.log(data);
 * });
 *
 * emitter.emit('test-type', 'test');
 *
 * // Arbitrary string type with known shape
 * const emitter = create<{ [key: string]: number }>();
 *
 * emitter.on('someKey', callback);
 *
 * emitter.emit('someKey', 123);
 *
 * // A mix of types
 * const emitter = create<{ 'test-type': string; [key: string]: number }>();
 *
 * emitter.on('test-type', (data) => {
 *   console.log(data);
 * });
 *
 * emitter.emit('test-type', 'test');
 * emitter.emit('arbitrary', 123);
 *
 * ```
 */
export const create = (opts = {}) => {
  const handlers = new Map();
  const remove = (type, callback) => {
    const callbacks = handlers.get(type);
    if (!callbacks) {
      return 0;
    }
    callbacks.delete(callback);
    if (callbacks.size === 0) {
      handlers.delete(type);
      return 0;
    }
    return callbacks.size;
  };
  function emit(type, data) {
    const callbacks = handlers.get(type);
    if (!callbacks) {
      return;
    }
    for (const callback of callbacks) {
      try {
        callback(data, () => remove(type, callback));
      } catch (error) {
        var _opts$onEmitError;
        if ((_opts$onEmitError = opts.onEmitError) !== null && _opts$onEmitError !== void 0 && _opts$onEmitError.call(opts, {
          type: type,
          data: data,
          error: error
        })) {
          throw error;
        }
      }
    }
  }
  return {
    /**
     * Get the current subscriber count for a specific event.
     *
     * @param type The event type to count
     * @returns The number of subscribers for this event
     *
     * @example
     * ```typescript
     * const off = emitter.on('event', callback);
     * emitter.count('event'); // 1
     * off();
     * emitter.count('event'); // 0
     *
     * ```
     */
    count: type => {
      var _handlers$get$size, _handlers$get;
      return (_handlers$get$size = (_handlers$get = handlers.get(type)) === null || _handlers$get === void 0 ? void 0 : _handlers$get.size) !== null && _handlers$get$size !== void 0 ? _handlers$get$size : 0;
    },
    /**
     * Get the current subscriber count for all events.
     *
     * @returns An object with event type as key and subscriber count as value
     *
     * @example
     * ```typescript
     * const emitter = create<{ event: string; anotherEvent: number }>();
     * const counts = emitter.countEach();
     * console.log(counts); // { event: 1, anotherEvent: 2 }
     * ```
     */
    countAll: () => {
      const counts = {};
      for (const [type, callbacks] of handlers) {
        counts[type] = callbacks.size;
      }
      return counts;
    },
    /**
     * Subscribe to an event.
     *
     * Returns an `off` callback to unsubscribe. `off`:
     * - returns the updated subscriber count
     * - is also provided as a second arg to the callback
     *
     * @param type The event type to subscribe to
     * @param callback The callback to call when the event is emitted
     * @returns A function to unsubscribe from the event
     *
     * @example
     * ```typescript
     * const off = emitter.on('event', console.log);
     *
     * emitter.emit('event', 'test'); // 'test'
     * off();
     * emitter.emit('event', 'test'); // nothing
     *
     * ```
     */
    on: (type, callback) => {
      let callbacks = handlers.get(type);
      if (!callbacks) {
        callbacks = new Set();
        handlers.set(type, callbacks);
      }
      callbacks.add(callback);
      return () => remove(type, callback);
    },
    /**
     * Emit an event of the specified type.
     *
     * If the data is typed as void or undefined, will not accept a data param.
     *
     * Prevents recursive emissions by throwing immediately (cannot be stopped by the error callback)
     *
     * @param type The event type to emit
     * @param data The data to emit
     *
     * @example
     * ```typescript
     * emitter.emit('event', 'test');
     * ```
     */
    emit,
    /**
     * Cleanup the emitter.
     */
    teardown: () => {
      handlers.clear();
    }
  };
};