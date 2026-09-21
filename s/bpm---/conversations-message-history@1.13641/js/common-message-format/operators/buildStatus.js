'use es6';

import getIn from 'transmute/getIn';
import SendFailure from '../records/SendFailure';
import Status from '../records/Status';
export const buildStatus = status => {
    const sendFailure = getIn(['sendFailure'], status);
    const statusSendFailure = sendFailure ? SendFailure(sendFailure) : null;
    return Status(status).setIn(['sendFailure'], statusSendFailure);
};