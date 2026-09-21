import { withHttpMethods } from './http';
export function composeFunctionsWithContext(functions) {
  if (!functions || functions.length === 0) {
    return (arg, __) => arg;
  }
  return functions.reduce((prevFn, nextFn) => (arg, context) => nextFn(prevFn(arg, context), context), (arg, __) => arg);
}
function createRequestContext(functions, params, context) {
  if (!functions || functions.length === 0) {
    return {};
  }
  const result = {};
  for (const fn of functions) {
    Object.assign(result, fn(params, context));
  }
  return result;
}

/**
 * Creates a wrapped fetch with context available in each part of the process.
 *
 * - Context: Defined on fetch init. Passed down into each function.
 * - Request Context: Functions that run each request to produce additional context.
 *                    Base context and fetch input are passed to each function.
 * - Middleware: Runs before fetch on the parameters to the fetch.
 * - Response Handler: Runs in the `.then` of the fetch result.
 * - Response Error Handler: Runs in the `.catch` of the fetch result.
 *                           Note that API errors don't get caught by default,
 *                           use the `throwOnFailed` handler to make such errors throw.
 *
 * Each of the middleware/response handlers is expected to return
 * the same type that it takes in the first argument. They are not expected to
 * be pure functions as they may have side-effects. They are reverse composed
 * (`[a, b, c]` --> `c.b.a`) before run on the input/response.
 *
 * Each function can define a slice of "context" that it will use. Context can
 * exist either at the fetcher level (created on fetcher init) or at the
 * request level (created when a request is made). The "context" parameter
 * defines fetcher context and is expected to be a record. The "requestContext"
 * parameter is expected to be an array of record-returning functions that are
 * run each time a request is made to build a requestContext object. Each
 * function is then passed the union of these two objects.
 *
 * The fetcher is type-safe with respect to the context and will produce an
 * error if any of the middleware/response handlers use context that does not exist
 * in the full context object.
 */
export function createWrappedFetch({
  context = {},
  requestContext = [],
  middleware,
  onResponse,
  onResponseError
}) {
  const composedMiddleware = composeFunctionsWithContext(middleware);
  const composedRespHandlers = composeFunctionsWithContext(onResponse);
  const composedRespErrorHandlers = composeFunctionsWithContext(onResponseError);
  const fetchFn = (input, init) => {
    const reqContext = createRequestContext(requestContext, {
      input,
      init
    }, context);

    // TODO: Do we need to freeze this at all? Or should this be a deep freeze?
    const fullContext = Object.freeze(Object.assign({}, context, reqContext));
    const processedInput = composedMiddleware({
      input,
      init
    }, fullContext);
    const handleResponse = responsePromise => responsePromise.then(response => composedRespHandlers(response, fullContext)).catch(reason => {
      composedRespErrorHandlers(reason, fullContext);
      throw reason;
    });
    return handleResponse(fetch(processedInput.input, processedInput.init));
  };
  return withHttpMethods(fetchFn);
}