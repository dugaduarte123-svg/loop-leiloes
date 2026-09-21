"use es6";

import {
    makeUniqueId
} from "apollo-stack-hubspot/@apollo/client/utilities/common/makeUniqueId";
export function stringifyForDisplay(value, space) {
    if (space === void 0) {
        space = 0;
    }
    var undefId = makeUniqueId("stringifyForDisplay");
    return JSON.stringify(value, function(key, value) {
        return value === void 0 ? undefId : value;
    }, space).split(JSON.stringify(undefId)).join("<undefined>");
}