"use es6";

import {
    getOperationName
} from "apollo-stack-hubspot/@apollo/client/utilities/index";
export function transformOperation(operation) {
    var transformedOperation = {
        variables: operation.variables || {},
        extensions: operation.extensions || {},
        operationName: operation.operationName,
        query: operation.query
    };
    // Best guess at an operation name
    if (!transformedOperation.operationName) {
        transformedOperation.operationName = typeof transformedOperation.query !== "string" ? getOperationName(transformedOperation.query) || undefined : "";
    }
    return transformedOperation;
}