/* hs-eslint ignored failing-rules */
/* eslint-disable hubspot-dev/no-confusing-browser-globals */

'use es6';

import changePoller from './changePoller';
export default changePoller(() => location.href);