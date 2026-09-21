"use es6";

import {
    __assign
} from "apollo-stack-hubspot/internal/tslib/tslib";
import {
    compact
} from "apollo-stack-hubspot/@apollo/client/utilities/common/compact";
export function mergeOptions(defaults, options) {
    return compact(defaults, options, options.variables && {
        variables: __assign(__assign({}, defaults && defaults.variables), options.variables)
    });
}