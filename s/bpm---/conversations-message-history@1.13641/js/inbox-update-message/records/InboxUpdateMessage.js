'use es6';

import {
    Map as ImmutableMap,
    Record
} from 'immutable';
import {
    NOT_DELETED
} from '../../common-message-format/constants/messageDeleteStatus';
import {
    THREAD_INBOX_UPDATED
} from '../constants/messageTypes';
class InboxUpdateMessage extends Record({
    ['@type']: THREAD_INBOX_UPDATED,
    id: null,
    timestamp: null,
    hiddenFromVisitor: false,
    messageDeletedStatus: NOT_DELETED,
    originInboxId: null,
    auditParams: ImmutableMap(),
    destinationInboxId: null
}, 'InboxUpdateMessage') {
    constructor(options = {}) {
        super(Object.assign({}, options, {
            auditParams: ImmutableMap(options.auditParams)
        }));
    }
}
export default InboxUpdateMessage;