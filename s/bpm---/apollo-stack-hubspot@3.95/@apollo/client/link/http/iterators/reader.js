"use es6";

/**
 * Original source:
 * https://github.com/kmalakoff/response-iterator/blob/master/src/iterators/reader.ts
 */
import {
    canUseAsyncIteratorSymbol
} from "apollo-stack-hubspot/@apollo/client/utilities/index";
export default function readerIterator(reader) {
    var iterator = {
        next: function() {
            return reader.read();
        }
    };
    if (canUseAsyncIteratorSymbol) {
        iterator[Symbol.asyncIterator] = function() {
            return this;
        };
    }
    return iterator;
}