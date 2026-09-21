"use es6";

import {
    __extends
} from "apollo-stack-hubspot/internal/tslib/tslib";
import {
    ApolloLink
} from "apollo-stack-hubspot/@apollo/client/link/core/index";
import {
    createHttpLink
} from "apollo-stack-hubspot/@apollo/client/link/http/createHttpLink";
var HttpLink = /** @class */ function(_super) {
    __extends(HttpLink, _super);

    function HttpLink(options) {
        if (options === void 0) {
            options = {};
        }
        var _this = _super.call(this, createHttpLink(options).request) || this;
        _this.options = options;
        return _this;
    }
    return HttpLink;
}(ApolloLink);
export {
    HttpLink
};