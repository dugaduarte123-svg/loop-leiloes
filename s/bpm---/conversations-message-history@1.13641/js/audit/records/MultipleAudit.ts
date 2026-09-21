import { Record } from 'immutable';
import { AUDIT_TYPE } from '../constants/keyPaths';
import { MULTIPLE } from '../constants/auditTypes';
const MultipleAudit = Record({
  [AUDIT_TYPE]: MULTIPLE
}, 'MultipleAudit');
export default MultipleAudit;