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
    ASSIGNMENT_UPDATE
} from '../constants/messageTypes';
import {
    buildAudit
} from '../../audit/operators/buildAudit';
import OriginatingAuditContext from '../../common-message-format/records/OriginatingAuditContext';
class AssignmentUpdateMessage extends Record({
    '@type': ASSIGNMENT_UPDATE,
    id: null,
    timestamp: null,
    sender: ImmutableMap(),
    messageDeletedStatus: NOT_DELETED,
    auditParams: buildAudit(),
    assignedActorId: null,
    assignedAgent: {
        agentId: null,
        agentType: null
    },
    unassignedAgent: {
        agentId: null,
        agentType: null
    },
    originatingAuditContext: null
}, 'AssignmentUpdateMessage') {
    constructor(props = {}) {
        const baseProps = Object.assign({}, props, {
            id: props.id || generateUuid(),
            auditParams: buildAudit(props.auditParams),
            timestamp: props.timestamp || generateUniqueClientTimestamp('AssignmentUpdateMessage-timestamp')
        });
        // Use fromJS only to deep-convert nested plain objects (e.g. auditParams),
        // then spread back to a plain object so Record can accept it.
        const converted = fromJS(baseProps).toObject();
        super(Object.assign({}, converted, {
            originatingAuditContext: props.originatingAuditContext ? new OriginatingAuditContext(props.originatingAuditContext) : null
        }));
    }
}
export default AssignmentUpdateMessage;