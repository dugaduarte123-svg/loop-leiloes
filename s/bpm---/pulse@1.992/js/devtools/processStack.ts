export const processStack = error => {
  var _error$stack;
  return (_error$stack = error.stack) === null || _error$stack === void 0 ? void 0 : _error$stack.split('\n').slice(0, 10).join('\n');
};