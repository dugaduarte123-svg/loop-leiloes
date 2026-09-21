"use es6";

import {
    newInvariantError
} from "apollo-stack-hubspot/@apollo/client/utilities/globals/index";
export var serializeFetchParameter = function serializeFetchParameter(p, label) {
    var serialized;
    try {
        serialized = JSON.stringify(p);
    } catch (e) {
        var parseError = newInvariantError(40, label, e.message);
        parseError.parseError = e;
        throw parseError;
    }
    return serialized;
};