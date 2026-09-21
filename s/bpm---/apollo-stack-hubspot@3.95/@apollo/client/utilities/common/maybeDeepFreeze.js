"use es6";

import {
    isNonNullObject
} from "apollo-stack-hubspot/@apollo/client/utilities/common/objects";

function deepFreeze(value) {
    var workSet = new Set([value]);
    workSet.forEach(function(obj) {
        if (isNonNullObject(obj) && shallowFreeze(obj) === obj) {
            Object.getOwnPropertyNames(obj).forEach(function(name) {
                if (isNonNullObject(obj[name])) workSet.add(obj[name]);
            });
        }
    });
    return value;
}

function shallowFreeze(obj) {
    if (process.env.NODE_ENV !== "production" && !Object.isFrozen(obj)) {
        try {
            Object.freeze(obj);
        } catch (e) {
            // Some types like Uint8Array and Node.js's Buffer cannot be frozen, but
            // they all throw a TypeError when you try, so we re-throw any exceptions
            // that are not TypeErrors, since that would be unexpected.
            if (e instanceof TypeError) return null;
            throw e;
        }
    }
    return obj;
}
export function maybeDeepFreeze(obj) {
    if (process.env.NODE_ENV !== "production") {
        deepFreeze(obj);
    }
    return obj;
}