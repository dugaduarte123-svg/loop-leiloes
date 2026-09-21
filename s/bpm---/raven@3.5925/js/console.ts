"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapMethod = wrapMethod;
function wrapMethod(console, level, callback) {
  const originalConsoleLevel = console[level];
  const originalConsole = console;
  if (!(level in console)) {
    return;
  }
  const sentryLevel = level === 'warn' ? 'warning' : level;
  console[level] = function (...args) {
    const msg = `${args.join(' ')}`;
    const data = {
      level: sentryLevel,
      logger: 'console',
      extra: {
        arguments: args
      }
    };
    if (level === 'assert') {
      if (args[0] === false) {
        // Default browsers message
        const assertMsg = `Assertion failed: ${args.slice(1).join(' ') || 'console.assert'}`;
        data.extra.arguments = args.slice(1);
        if (callback) {
          callback(assertMsg, data);
        }
      }
    } else if (callback) {
      callback(msg, data);
    }

    // this fails for some browsers. :(
    if (originalConsoleLevel) {
      // IE9 doesn't allow calling apply on console functions directly
      // See: https://stackoverflow.com/questions/5472938/does-ie9-support-console-log-and-is-it-a-real-function#answer-5473193
      Function.prototype.apply.call(originalConsoleLevel, originalConsole, args);
    }
  };
}