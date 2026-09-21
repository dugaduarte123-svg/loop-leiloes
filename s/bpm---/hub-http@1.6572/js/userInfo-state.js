'use es6';

let memoizedPromise;
let memoizedInfo;

/**
 * ⚠️ Should only be called as part of build time tests
 * During an integration test:
 * - prevent the first response from being re-used
 * - allow to simulate multiple userInfo scenario
 */
export function clearCacheForTesting() {
    memoizedPromise = undefined;
    memoizedInfo = undefined;
}
export function getMemoizedPromise() {
    return memoizedPromise;
}
export function setMemoizedPromise(prom) {
    memoizedPromise = prom;
}
export function getMemoizedInfo() {
    return memoizedInfo;
}
export function setMemoizedInfo(info) {
    memoizedInfo = info;
}