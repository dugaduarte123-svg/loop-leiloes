export function buildHttpRpcPath(details, pathParameters) {
  const pathBuilder = [details.baseUrl];
  let pathParametersIndex = 0;
  for (const segment of details.pathSegments) {
    if (segment !== undefined) {
      pathBuilder.push(segment);
    } else {
      if (!pathParameters || !details.pathParameters || pathParametersIndex >= details.pathParameters.length) {
        // likely:
        // - A) there is a bug in client-types to surface in #frontend-platform-support
        // - B) the details object was created manually, which is not a supported use case
        //      for this function. Reach out in #frontend-platform-support for brainstorming
        throw new Error('Malformed RPC details object detected');
      }
      const pathParameterName = details.pathParameters[pathParametersIndex++];
      if (!Object.prototype.hasOwnProperty.call(pathParameters, pathParameterName)) {
        throw new Error(`Required path parameter "${pathParameterName}" missing`);
      }
      pathBuilder.push(pathParameters[pathParameterName]);
    }
  }
  return pathBuilder.join('/');
}
export function defaultDismissErrorWithoutHandling(error) {
  // We are intentionally triggering an unhandled promise in order to fall back
  // on default error reporting without bailing out of ongoing synchronous work.
  // eslint-disable-next-line promise/catch-or-return, @typescript-eslint/no-floating-promises
  Promise.reject(error);
}