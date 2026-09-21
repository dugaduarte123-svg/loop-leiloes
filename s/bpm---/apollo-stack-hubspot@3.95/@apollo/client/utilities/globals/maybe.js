"use es6";

export function maybe(thunk) {
    try {
        return thunk();
    } catch (_a) {}
}