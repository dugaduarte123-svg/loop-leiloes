'use es6';

import {
    createStack
} from '../index';
import * as core from '../middlewares/core';
import * as hubapi from '../middlewares/hubapi';
import * as debug from '../middlewares/debug';
export default createStack(core.services, hubapi.defaults, debug.allowTimeoutOverride, core.jsonBody, core.httpsOnly, hubapi.hubapi, core.withQuery, debug.rewriteUrl, debug.enableFailureInjection, core.reportOptionsError, hubapi.retryOnError, core.validateStatus, core.jsonResponse);