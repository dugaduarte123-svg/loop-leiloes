export const callIfValid = (func, ...args) => {
  if (typeof func === 'function') func(...args);
};