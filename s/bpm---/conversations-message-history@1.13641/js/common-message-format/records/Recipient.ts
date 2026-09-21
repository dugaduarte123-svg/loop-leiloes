import { Record, Map as ImmutableMap } from 'immutable';
import get from 'transmute/get';
import DeliveryIdentifier from './DeliveryIdentifier';

/*
this is the endgame of the JSON we will receive from the backend
- deliveryIdentifier is a single DeliveryIdentifier object
- no singleDeliveryIdentifier
- in this version of FE code, if we receive JSON matching this interface from the BE, then we want to reshape it to match the current RecipientRecord
  - could happen if BE has made the update but user has not refreshing web inbox or hasn't downloaded a mobile update
  - prevents errors in this version of FE code by reinforcing that deliveryIdentifier is as List<DeliveryIdentifier> until we are confident we've updated all consumers to expect a single object instead of list

actively will be working to transition towards this shape as source of truth by
0. add singleDeliveryIdentifier to Recipient record
1. attempting to update all references to the Recipient delivery identifier to singleDeliveryIdentifier property
2. [BREAKING] removing the deliveryIdentifier property, ensuring that nothing breaks because it was still referencing the field that was a list
3. reintroducing the deliveryIdentifier property of the new, correct type (DeliveryIdentifier)
4. updating references to point towards deliveryIdentifier
5. [BREAKING] delete singleDeliveryIdentifier property from record
*/

function isDeliveryIdentifierRecord(obj) {
  return obj && typeof obj.type === 'string' && typeof obj.value === 'string';
}
function getIsDeliveryIdentifierList(props) {
  const deliveryIdentifier = get('deliveryIdentifier', props);
  return Boolean(deliveryIdentifier && !isDeliveryIdentifierRecord(deliveryIdentifier) && 'length' in deliveryIdentifier && !ImmutableMap.isMap(deliveryIdentifier));
}
function makeDeliveryIdentifiersFromList(props) {
  const singleDeliveryIdentifier = DeliveryIdentifier(get('singleDeliveryIdentifier', props));
  return {
    singleDeliveryIdentifier
  };
}
function makeDeliveryIdentifiersFromSingleObject(props) {
  const singleDeliveryIdentifier = get('singleDeliveryIdentifier', props) ? DeliveryIdentifier(get('singleDeliveryIdentifier', props)) : DeliveryIdentifier(get('deliveryIdentifier', props));
  return {
    singleDeliveryIdentifier
  };
}
function toRecordProps(props) {
  const actorId = get('actorId', props);
  const recipientField = get('recipientField', props);
  const {
    singleDeliveryIdentifier
  } = getIsDeliveryIdentifierList(props) ? makeDeliveryIdentifiersFromList(props) : makeDeliveryIdentifiersFromSingleObject(props);
  const name = get('name', props);
  return {
    actorId,
    recipientField,
    singleDeliveryIdentifier,
    deliveryIdentifier: singleDeliveryIdentifier,
    name
  };
}
const Recipient = Record({
  actorId: null,
  singleDeliveryIdentifier: DeliveryIdentifier(),
  deliveryIdentifier: DeliveryIdentifier(),
  recipientField: null,
  name: null
}, 'Recipient');
// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
  const immutableProps = toRecordProps(props);
  return Recipient(immutableProps);
}