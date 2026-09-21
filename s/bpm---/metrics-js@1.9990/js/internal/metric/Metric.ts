"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Metric = void 0;
class Metric {
  constructor(name, dimensions) {
    this.name = name;
    this.dimensions = this.filterStringDimensions(dimensions);
  }
  filterStringDimensions(dimensions) {
    const filtered = {};
    for (const [key, value] of Object.entries(dimensions)) {
      if (typeof value === 'string') {
        filtered[key] = value;
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.error(`[metrics-js] Metric ${this.name} received a non-string dimension value for key "${key}" (${typeof value}: ${value}).\n\nDimensions must be string values only. Non-string values have been filtered out.\nIf you need to track non-string data, please convert it to a string first.\nIf you have further questions please reach out in #frontend-platform-support.`);
        }
      }
    }
    return filtered;
  }
  getDimensions() {
    return this.dimensions;
  }
  getName() {
    return this.name;
  }
  getSeries(qualifier) {
    return [this.name, qualifier].join('.');
  }
  toString() {
    return JSON.stringify({
      name: this.getName(),
      dimensions: this.getDimensions()
    }, null, 2);
  }
}
exports.Metric = Metric;