import { Record } from 'immutable';
import { AUDIT_TYPE } from '../constants/keyPaths';
import { VISITOR } from '../constants/auditTypes';
const VisitorAudit = Record({
  [AUDIT_TYPE]: VISITOR,
  vid: null
}, 'VisitorAudit');
export default VisitorAudit;