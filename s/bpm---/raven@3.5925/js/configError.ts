"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class RavenConfigError extends Error {
  constructor(message) {
    super();
    this.name = 'RavenConfigError';
    this.message = message;
  }
}
var _default = exports.default = RavenConfigError;
module.exports = exports.default;