'use es6';

import {
    getMockAuth
} from '../internal/authMocked';

/**
 * We cannot solely rely on the options for quick-fetch early request
 */
export function isAuthMocked(options = {}) {
    if (options.mockAuth !== undefined) return Boolean(options.mockAuth);
    return getMockAuth();
}