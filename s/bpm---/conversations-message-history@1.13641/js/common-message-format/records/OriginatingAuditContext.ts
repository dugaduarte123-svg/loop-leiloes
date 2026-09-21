import { Record } from 'immutable';
import { buildAudit } from '../../audit/operators/buildAudit';

/** Input type for the OriginatingAuditContext constructor — use this instead of
 * repeating the inline shape in each message record. */

class OriginatingAuditContext extends Record({
  auditParams: null,
  originatingThreadId: null,
  trigger: null
}, 'OriginatingAuditContext') {
  constructor(props = {}) {
    var _props$originatingThr, _props$trigger;
    super({
      auditParams: props.auditParams ? buildAudit(props.auditParams) : null,
      originatingThreadId: (_props$originatingThr = props.originatingThreadId) !== null && _props$originatingThr !== void 0 ? _props$originatingThr : null,
      trigger: (_props$trigger = props.trigger) !== null && _props$trigger !== void 0 ? _props$trigger : null
    });
  }
}
export default OriginatingAuditContext;