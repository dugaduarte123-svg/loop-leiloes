"use es6";

import {
    isNonEmptyArray
} from "apollo-stack-hubspot/@apollo/client/utilities/common/arrays";
import {
    isExecutionPatchIncrementalResult
} from "apollo-stack-hubspot/@apollo/client/utilities/common/incrementalResult";
export function graphQLResultHasError(result) {
    var errors = getGraphQLErrorsFromResult(result);
    return isNonEmptyArray(errors);
}
export function getGraphQLErrorsFromResult(result) {
    var graphQLErrors = isNonEmptyArray(result.errors) ? result.errors.slice(0) : [];
    if (isExecutionPatchIncrementalResult(result) && isNonEmptyArray(result.incremental)) {
        result.incremental.forEach(function(incrementalResult) {
            if (incrementalResult.errors) {
                graphQLErrors.push.apply(graphQLErrors, incrementalResult.errors);
            }
        });
    }
    return graphQLErrors;
}