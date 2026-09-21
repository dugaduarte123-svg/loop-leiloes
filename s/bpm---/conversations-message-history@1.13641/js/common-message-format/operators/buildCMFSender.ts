import invariant from 'react-utils/invariant';
import * as legacySenderTypes from '../constants/legacySenderTypes';
import { EMAIL_ACTOR } from '../constants/actorTypes';
import { getActorFromSenderType } from './senderActorMapping';
import Sender from '../records/Sender';
const legacySenderTypesArray = Object.keys(legacySenderTypes);
export const buildCMFSender = ({
  senderType = null,
  senderId = null,
  senderField = null,
  deliveryIdentifier = null
}) => {
  invariant(senderType === null || legacySenderTypesArray.includes(senderType), `Invalid sender type. Should be one of ${legacySenderTypesArray.join(' | ')}. Received %s`, senderType);
  const actorType = senderType === null ? null : getActorFromSenderType(senderType);
  return Sender({
    actorId: actorType && actorType !== EMAIL_ACTOR && senderId ? `${actorType}-${senderId}` : undefined,
    senderField,
    deliveryIdentifier
  });
};