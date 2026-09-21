import { Record } from 'immutable';
import { AUDIT_TYPE } from '../constants/keyPaths';
import { BOT_HANDOFF } from '../constants/auditTypes';
const BotHandoffAudit = Record({
  [AUDIT_TYPE]: BOT_HANDOFF,
  botId: null
}, 'BotHandoffAudit');
export default BotHandoffAudit;