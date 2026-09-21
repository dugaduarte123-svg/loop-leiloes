import { Record } from 'immutable';
import { AUDIT_TYPE } from '../constants/keyPaths';
import { MANUAL } from '../constants/auditTypes';
const ManualAudit = Record({
  [AUDIT_TYPE]: MANUAL,
  agentId: null,
  agentType: null
}, 'ManualAudit');
export default ManualAudit;