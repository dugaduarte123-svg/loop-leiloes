"use es6";

import {
    isNonNullObject
} from "apollo-stack-hubspot/@apollo/client/utilities/common/objects";
import {
    isNonEmptyArray
} from "apollo-stack-hubspot/@apollo/client/utilities/common/arrays";
import {
    DeepMerger
} from "apollo-stack-hubspot/@apollo/client/utilities/common/mergeDeep";
export function isExecutionPatchIncrementalResult(value) {
    return "incremental" in value;
}
export function isExecutionPatchInitialResult(value) {
    return "hasNext" in value && "data" in value;
}
export function isExecutionPatchResult(value) {
    return isExecutionPatchIncrementalResult(value) || isExecutionPatchInitialResult(value);
}
// This function detects an Apollo payload result before it is transformed
// into a FetchResult via HttpLink; it cannot detect an ApolloPayloadResult
// once it leaves the link chain.
export function isApolloPayloadResult(value) {
    return isNonNullObject(value) && "payload" in value;
}
export function mergeIncrementalData(prevResult, result) {
    var mergedData = prevResult;
    var merger = new DeepMerger();
    if (isExecutionPatchIncrementalResult(result) && isNonEmptyArray(result.incremental)) {
        result.incremental.forEach(function(_a) {
            var data = _a.data,
                path = _a.path;
            for (var i = path.length - 1; i >= 0; --i) {
                var key = path[i];
                var isNumericKey = !isNaN(+key);
                var parent_1 = isNumericKey ? [] : {};
                parent_1[key] = data;
                data = parent_1;
            }
            mergedData = merger.merge(mergedData, data);
        });
    }
    return mergedData;
}