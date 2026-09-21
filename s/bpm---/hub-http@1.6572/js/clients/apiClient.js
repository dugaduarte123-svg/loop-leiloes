'use es6';

import promiseClient from '../adapters/promiseClient';
import hubapiStack from '../stacks/hubapi';
export default promiseClient(hubapiStack);