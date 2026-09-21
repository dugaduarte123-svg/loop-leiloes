"use es6";

export var selectURI = function selectURI(operation, fallbackURI) {
    var context = operation.getContext();
    var contextURI = context.uri;
    if (contextURI) {
        return contextURI;
    } else if (typeof fallbackURI === "function") {
        return fallbackURI(operation);
    } else {
        return fallbackURI || "/graphql";
    }
};