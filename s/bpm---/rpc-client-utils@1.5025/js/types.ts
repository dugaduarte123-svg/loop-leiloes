/**
 * An Object with type annotations containing all the network and type
 * information needed to model an http request as an RPC. See
 * `createHttpRpcClientV1` for more details.
 */

/**
 * Represents a handler for streaming RPC responses.
 * Extends Promise to allow for both streaming callbacks and traditional await pattern.
 * When the stream completes successfully, the Promise resolves.
 * When there's an error, the Promise rejects with the error.
 *
 * Usage:
 * - Use .onConnected() to be notified when the connection is established
 * - Use .onMessage() to process data chunks as they arrive
 * - Use .then() to handle stream completion (instead of onClose)
 * - Use .catch() to handle transport errors (instead of onError)
 * - Use .abort() to stop the stream early
 * - Domain errors (from the RPC) come through the data stream as results with type: 'rpcError'
 */

/**
 * The path parameters, query parameters, and request body for an RPC request
 * are passed as object properties to the RPC client function. This object is
 * relatively simple, but its type is highly overloaded depending on which
 * pieces of data are required for a given RPC. The complexity of this type is
 * mostly to do with determining whether each of the three properties on this
 * type should be required given the RPC being executed. Most of the time
 * you can think of this type as:
 *
 * ```
 * interface RpcInputs<RequestBody, PathParameters, QueryParameters> {
 *   data?: RequestBody,
 *   pathParameters?: PathParameters,
 *   queryParameters?: QueryParameters
 * }
 * ```
 */

const _unhandledEnumCase = Symbol('unhandled-enum-case');
/**
 * `unhandledEnumCase` is an opaque type brand representing values which could
 * later be added to an enum. You can access the underlying `string` type of
 * unhandled enum cases using the `readUnhandledEnumCase` utility function. The
 * presence of this type is intended to force consumers to handle enum expansion
 * gracefully. This guardrail is massively beneficial to backend engineers
 * because it means enum expansion doesn't count as a breaking change from a
 * schema evolution perspective.
 */

export function readUnhandledEnumCase(unhandledEnumCase) {
  if (typeof unhandledEnumCase === 'string') {
    return unhandledEnumCase;
  }
  // this should never happen. The type unhandledEnumCase should always at
  // runtime be a string. We don't support non-string enums.
  throw new Error('unhandledEnumCase had unexpected non-string type');
}
export const HUBSPOT_CORRELATION_ID_KEY = '__correlationId';