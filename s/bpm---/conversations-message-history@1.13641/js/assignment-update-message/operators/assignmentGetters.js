'use es6';

import getIn from 'transmute/getIn';
import {
    ASSSIGNED_AGENT_ID,
    ASSSIGNED_AGENT_TYPE,
    AUDIT_PARAMS,
    ASSIGNED_AGENT
} from '../constants/keyPaths';
import {
    getAgentIdFromAudit as getAuditAgentId
} from '../../audit/operators/getAgentIdFromAudit';
import {
    getAgentTypeFromAudit as getAuditAgentType
} from '../../audit/operators/getAgentTypeFromAudit';

// shoud replace getAssignedAgentId and getAssigneeIdForAssignmentMessage
export const getAssignedAgentId = getIn(ASSSIGNED_AGENT_ID);

// should replace getAssignedAgentType
export const getAssignedAgentType = getIn(ASSSIGNED_AGENT_TYPE);
export const getAudit = getIn(AUDIT_PARAMS);

// should replace getAgentId
export const getAgentIdFromAudit = message => {
    const audit = getAudit(message);
    return getAuditAgentId(audit);
};

// should replace getAgentType
export const getAgentTypeFromAudit = message => {
    const audit = getAudit(message);
    const agentType = getAuditAgentType(audit);
    return agentType;
};

// should replace getAssignedAgent
export const getAssignedAgent = getIn(ASSIGNED_AGENT);