import { Iterable, OrderedMap } from 'immutable';
import invariant from 'react-utils/invariant';
// @ts-ignore ts-migrate
import { getId } from '../../common-message-format/operators/commonMessageFormatGetters';
import { buildMessageFromType } from './buildMessageFromType';
import { generateUuid } from '../../util/generateUuid';

/**
 * Construct an OrderedMap<string, MessageRecord> from an iterable of MessageRecords.
 *
 * **Note:** When a message's `id` is `null`, the map key is a generated UUID
 * that differs from the record's `id`. Downstream code must not assume
 * `key === getId(message)` for null-id messages, or it will re-collide them
 * (e.g. reconstructing via `OrderedMap(values.map(m => [getId(m), m]))`).
 *
 * @param {OrderedMap<string, MessageRecord> | MessageRecord[]} messages Message objects returned by the history API
 */
export const buildOrderedMessageMap = (messages = OrderedMap()) => {
  invariant(Iterable.isIterable(messages) || Array.isArray(messages), 'Expected messages to be iterable not a `%s`', typeof messages);
  return messages.reduce((acc, messageObject) => {
    const message = buildMessageFromType(messageObject);
    const id = getId(message);
    const key = id !== null && id !== void 0 ? id : generateUuid();
    return acc.set(key, message);
  }, OrderedMap());
};