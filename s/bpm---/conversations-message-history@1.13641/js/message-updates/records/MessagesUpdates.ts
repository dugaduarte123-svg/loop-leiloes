// @ts-ignore module not typed
import { buildUpdates } from '../operators/buildUpdates';
import { Map as ImmutableMap, Record } from 'immutable';
import { MESSAGES_UPDATED } from '../constants/messageTypes';
/**
 * A message that indicates that a CMF has been updated
 *
 * @param {Object} auditParams one of five types of audit with id: SYSTEM_TEST, SYSTEM_MIGRATION, MANUAL, BOT_HANDOFF, INTEGRATOR_AUDIT to indicate the source of this update
 * @param {String} auditParams.id id of either the Bot or the
 * @param {Map} updates a map of message id to updates
 * @param {Map} updates.messageId map of an update of Status and/or messageDeleteStatus
 *
 **/
export default class MessagesUpdates extends Record({
  '@type': MESSAGES_UPDATED,
  auditParams: ImmutableMap(),
  updates: ImmutableMap()
}, 'MessagesUpdates') {
  // audit is not present on the incoming type but was listed here in the old JS form. Preserving it here for backwards compatibility in case it's not a typo
  constructor(properties = {}) {
    super({
      updates: buildUpdates(properties),
      // Possibly unused?
      auditParams: ImmutableMap((properties === null || properties === void 0 ? void 0 : properties.audit) || {})
    });
  }
}