'use es6';

import {
    buildCMFSender
} from './buildCMFSender';
import {
    List
} from 'immutable';
import {
    SYSTEM
} from '../constants/legacySenderTypes';
import {
    SYSTEM_SENDER_ID
} from '../constants/systemSenderId';
export const buildHubSpotSystemSender = () => List([buildCMFSender({
    senderType: SYSTEM,
    senderId: SYSTEM_SENDER_ID
})]);