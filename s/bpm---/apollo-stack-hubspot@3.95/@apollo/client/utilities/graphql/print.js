"use es6";

import {
    print as origPrint
} from "graphql/language/printer";
import {
    AutoCleanedWeakCache,
    cacheSizes
} from "apollo-stack-hubspot/@apollo/client/utilities/caching/index";
import {
    registerGlobalCache
} from "apollo-stack-hubspot/@apollo/client/utilities/caching/getMemoryInternals";
var printCache;
export var print = Object.assign(function(ast) {
    var result = printCache.get(ast);
    if (!result) {
        result = origPrint(ast);
        printCache.set(ast, result);
    }
    return result;
}, {
    reset: function() {
        printCache = new AutoCleanedWeakCache(cacheSizes.print || 2000 /* defaultCacheSizes.print */ );
    }
});
print.reset();
if (process.env.NODE_ENV !== "production") {
    registerGlobalCache("print", function() {
        return printCache ? printCache.size : 0;
    });
}