"use es6";

import {
    Observable
} from "apollo-stack-hubspot/@apollo/client/utilities/index";
export function fromPromise(promise) {
    return new Observable(function(observer) {
        promise.then(function(value) {
            observer.next(value);
            observer.complete();
        }).catch(observer.error.bind(observer));
    });
}