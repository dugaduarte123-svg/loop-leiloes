'use es6';

import {
    createStack
} from '../index';
import promiseClient from '../adapters/promiseClient';
import * as core from '../middlewares/core';
import * as hubapi from '../middlewares/hubapi';
import * as debug from '../middlewares/debug';
import * as user from '../middlewares/user';
import {
    stringify
} from '../helpers/params';
export default promiseClient(createStack(core.services, hubapi.defaults, user.recyclePromise, debug.allowTimeoutOverride, user.portalIdBody, core.bodyType('application/x-www-form-urlencoded', stringify), user.hubUserInfoEndpointTest, core.httpsOnly, debug.rewriteUrl, core.reportOptionsError, user.logoutOnUnauthorizedOrForbidden, core.enableMigrationCheckBypass, core.redirectOnMigrationInProgress, core.redirectOnPortalMoved, user.retryOnError, core.jsonResponse, user.redirectSuspendedUsers));