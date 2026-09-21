import { Record } from 'immutable';
import { AUDIT_TYPE } from '../constants/keyPaths';
import { UNKNOWN } from '../constants/auditTypes';
const UnknownAudit = Record({
  [AUDIT_TYPE]: UNKNOWN
}, 'UnknownAudit');
export default UnknownAudit;