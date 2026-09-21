import { Record } from 'immutable';
import get from 'transmute/get';
import DeliveryIdentifier from './DeliveryIdentifier';
const defaultSenderProps = {
  actorId: null,
  deliveryIdentifier: null,
  senderField: null,
  name: null,
  isActive: null,
  isAuthorized: null
};
const Sender = Record(defaultSenderProps, 'Sender');
// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
  if (!props) return Sender();
  const actorId = get('actorId', props) || defaultSenderProps.actorId;
  const deliveryIdentifierVal = get('deliveryIdentifier', props);
  const deliveryIdentifier = deliveryIdentifierVal ? DeliveryIdentifier(deliveryIdentifierVal) : defaultSenderProps.deliveryIdentifier;
  const senderField = get('senderField', props) || defaultSenderProps.senderField;
  const name = get('name', props) || defaultSenderProps.name;
  const isActive = get('isActive', props) || defaultSenderProps.isActive;
  const isAuthorized = get('isAuthorized', props) || defaultSenderProps.isAuthorized;
  return Sender({
    actorId,
    deliveryIdentifier,
    senderField,
    name,
    isActive,
    isAuthorized
  });
}