'use es6';

import {
    createStack
} from '../index';
import * as core from '../middlewares/core';
import * as hubapi from '../middlewares/hubapi';
import * as debug from '../middlewares/debug';
import * as externalAuth from '../middlewares/externalAuth';
export default createStack(core.services, hubapi.defaults, debug.allowTimeoutOverride, core.jsonBody, core.httpsOnly, hubapi.hubapi, externalAuth.cookieAuthentication, core.withQuery, debug.rewriteUrl, debug.enableFailureInjection, hubapi.timeoutInQuery, hubapi.setRequest, core.reportOptionsError, hubapi.logoutOnUnauthorized, core.enableMigrationCheckBypass, core.redirectOnMigrationInProgress, core.redirectOnPortalMoved, hubapi.retryOnError, core.validateStatus, core.jsonResponse);