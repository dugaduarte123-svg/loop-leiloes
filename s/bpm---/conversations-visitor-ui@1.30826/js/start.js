'use es6';

import {
    hasRequiredFeatures
} from './utils/hasRequiredFeatures';

/*
 * Check required features before evaluating the rest of the application bundle.
 * This will prevent the app from throwing an exception when a required feature is missing (eg: WeakMap).
 */
if (hasRequiredFeatures(window)) {
    require('conversations-visitor-ui/Application');
}