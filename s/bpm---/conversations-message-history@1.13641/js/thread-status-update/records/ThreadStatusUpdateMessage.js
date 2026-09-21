'use es6';

import {
    Record,
    fromJS,
    Map as ImmutableMap
} from 'immutable';
import {
    NOT_DELETED
} from '../../common-message-format/constants/messageDeleteStatus';
import {
    generateUniqueClientTimestamp
} from '../../util/timestamps';
import {
    generateUuid
} from '../../util/generateUuid';
import {
    THREAD_STATUS_UPDATE
} from '../constants/messageTypes';
import {
    buildAudit
} from '../../audit/operators/buildAudit';
class ThreadStatusUpdateMessage extends Record({
    '@type': THREAD_STATUS_UPDATE,
    id: null,
    timestamp: null,
    sender: ImmutableMap(),
    messageDeletedStatus: NOT_DELETED,
    auditParams: buildAudit(),
    currentStatus: null,
    previousStatus: null
}, 'ThreadStatusUpdateMessage') {
    constructor(props = {}) {
        const map = fromJS(Object.assign({}, props, {
            id: props.id || generateUuid(),
            auditParams: buildAudit(props.auditParams),
            timestamp: props.timestamp || generateUniqueClientTimestamp('ThreadStatusUpdateMessage-timestamp')
        })).filterNot(value => typeof value === 'undefined');
        super(map);
    }
}
export default ThreadStatusUpdateMessage;