"use es6";

import {
    Observable
} from "apollo-stack-hubspot/@apollo/client/utilities/index";
export function fromError(errorValue) {
    return new Observable(function(observer) {
        observer.error(errorValue);
    });
}