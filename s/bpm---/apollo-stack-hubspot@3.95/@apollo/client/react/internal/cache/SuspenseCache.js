"use es6";

import {
    Trie
} from "apollo-stack-hubspot/internal/@wry/trie/lib/index";
import {
    canUseWeakMap
} from "apollo-stack-hubspot/@apollo/client/utilities/index";
import {
    InternalQueryReference
} from "apollo-stack-hubspot/@apollo/client/react/internal/cache/QueryReference";
var SuspenseCache = /** @class */ function() {
    function SuspenseCache(options) {
        if (options === void 0) {
            options = Object.create(null);
        }
        this.queryRefs = new Trie(canUseWeakMap);
        this.options = options;
    }
    SuspenseCache.prototype.getQueryRef = function(cacheKey, createObservable) {
        var ref = this.queryRefs.lookupArray(cacheKey);
        if (!ref.current) {
            ref.current = new InternalQueryReference(createObservable(), {
                autoDisposeTimeoutMs: this.options.autoDisposeTimeoutMs,
                onDispose: function() {
                    delete ref.current;
                }
            });
        }
        return ref.current;
    };
    SuspenseCache.prototype.add = function(cacheKey, queryRef) {
        var ref = this.queryRefs.lookupArray(cacheKey);
        ref.current = queryRef;
    };
    return SuspenseCache;
}();
export {
    SuspenseCache
};