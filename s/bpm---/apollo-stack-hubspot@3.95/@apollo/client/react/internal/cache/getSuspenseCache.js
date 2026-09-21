"use es6";

import {
    SuspenseCache
} from "apollo-stack-hubspot/@apollo/client/react/internal/cache/SuspenseCache";
var suspenseCacheSymbol = Symbol.for("apollo.suspenseCache");
export function getSuspenseCache(client) {
    var _a;
    if (!client[suspenseCacheSymbol]) {
        client[suspenseCacheSymbol] = new SuspenseCache((_a = client.defaultOptions.react) === null || _a === void 0 ? void 0 : _a.suspense);
    }
    return client[suspenseCacheSymbol];
}