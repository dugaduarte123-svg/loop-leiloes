import { Record } from 'immutable';
import { AUDIT_TYPE } from '../constants/keyPaths';
import { SYSTEM_TEST } from '../constants/auditTypes';
const SystemTestAudit = Record({
  [AUDIT_TYPE]: SYSTEM_TEST
}, 'SystemTestAudit');
export default SystemTestAudit;