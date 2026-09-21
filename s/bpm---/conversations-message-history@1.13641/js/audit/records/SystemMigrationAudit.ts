import { Record } from 'immutable';
import { AUDIT_TYPE } from '../constants/keyPaths';
import { SYSTEM_MIGRATION } from '../constants/auditTypes';
const SystemMigrationAudit = Record({
  [AUDIT_TYPE]: SYSTEM_MIGRATION
}, 'SystemMigrationAudit');
export default SystemMigrationAudit;