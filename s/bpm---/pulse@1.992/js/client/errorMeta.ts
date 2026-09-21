const errorMetaMap = new WeakMap();
export const setResourceErrorMeta = (error, meta) => {
  if (!errorMetaMap.has(error)) {
    errorMetaMap.set(error, meta);
  }
};
export const getResourceErrorMeta = error => {
  var _errorMetaMap$get;
  if (!(error instanceof Error)) {
    return null;
  }
  return (_errorMetaMap$get = errorMetaMap.get(error)) !== null && _errorMetaMap$get !== void 0 ? _errorMetaMap$get : null;
};
export const isResourceError = error => error instanceof Error && errorMetaMap.has(error);
export const getResourceError = (resource, error) => {
  if (!(error instanceof Error)) {
    return null;
  }
  const meta = errorMetaMap.get(error);
  if (meta && meta.typeName === resource.typeName) {
    return error;
  }
  return null;
};

/**
 * @deprecated Prefer calling `getResourceErrorMeta` to get metadata about the error
 */
export class ResourcePromiseError extends Error {
  constructor({
    cause,
    meta
  }) {
    super(cause.message, {
      cause
    });
    this.typeName = meta.typeName;
    this.instanceKey = meta.instanceKey;
    this.params = meta.params;
  }
}

/**
 * @deprecated Prefer calling `isResourceError` to determine whether an error was thrown
 * by the resource system
 *
 * Warning: This mutates the error object to preserve compat with our one current consumer.
 */
export const isResourcePromiseError = error => error instanceof ResourcePromiseError;