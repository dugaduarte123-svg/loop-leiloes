/**
 * This function provides a consistent way to access the global object across
 * different environments, including both Node.js and web browsers, by using
 * `globalThis`. This approach ensures compatibility and simplifies accessing
 * global properties in diverse runtime contexts.
 * e.g. window in browser, global in node, etc.
 *
 * @returns {Object} An object that may contain the properties of `globalThis`,
 * if available.
 */
export function getGlobal() {
  return typeof globalThis !== 'undefined' && globalThis || {};
}
export function getFetch() {
  return getGlobal().fetch;
}

// Type definitions that work in both browser and Node.js environments

// Extract HeadersInit from fetch's parameters if available, otherwise use a compatible type

// Ensure localStorage type is either the actual type or any (not never)

/**
 * Type-safe localStorage access that works in both browser and Node.js environments
 * @returns localStorage if available, undefined otherwise
 */
export function getLocalStorage() {
  const global = getGlobal();
  return typeof global !== 'undefined' && typeof global.localStorage !== 'undefined' ? global.localStorage : undefined;
}

/**
 * Type-safe sessionStorage access that works in both browser and Node.js environments
 * @returns sessionStorage if available, undefined otherwise
 */
export function getSessionStorage() {
  const global = getGlobal();
  return typeof global !== 'undefined' && typeof global.sessionStorage !== 'undefined' ? global.sessionStorage : undefined;
}