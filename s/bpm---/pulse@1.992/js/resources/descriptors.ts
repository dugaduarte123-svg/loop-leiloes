export const skipToken = Symbol.for('pulse.skipToken');
export const isSkipToken = value => value === skipToken;
export const emptyInitialParams = Object.freeze({});
export const normalizeResourceOptions = options => {
  var _options$params;
  const skipTokenPassed = isSkipToken(options === null || options === void 0 ? void 0 : options.params);
  const params = skipTokenPassed ? emptyInitialParams : (_options$params = options === null || options === void 0 ? void 0 : options.params) !== null && _options$params !== void 0 ? _options$params : emptyInitialParams;
  const skip = !!(options !== null && options !== void 0 && options.skip) || skipTokenPassed;
  return {
    params,
    skip,
    pollInterval: options === null || options === void 0 ? void 0 : options.pollInterval,
    pollGroup: options === null || options === void 0 ? void 0 : options.pollGroup,
    httpClient: options === null || options === void 0 ? void 0 : options.httpClient,
    passive: options === null || options === void 0 ? void 0 : options.passive
  };
};