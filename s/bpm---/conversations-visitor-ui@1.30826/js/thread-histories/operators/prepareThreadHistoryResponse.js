'use es6';

import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["attachments", "hasVisitorEmail"];
import {
    buildThreadHistoryFromResponse
} from './buildThreadHistoryFromResponse';
export const prepareThreadHistoryResponse = _ref => {
    let {
        // `attachments` is pulled out (and intentionally unused) so it is excluded
        // from `...threadHistory`; resolved attachments are now fetched on demand via
        // the useResolvedFileAttachments Pulse hook rather than stored in Redux.

        hasVisitorEmail
    } = _ref,
    threadHistory = _objectWithoutPropertiesLoose(_ref, _excluded);
    return {
        threadHistory: buildThreadHistoryFromResponse(threadHistory),
        hasVisitorEmail
    };
};