import get from 'transmute/get';
export const getActorId = get('actorId');
export const getActorType = sender => {
  const actorId = getActorId(sender) || '';
  const parts = actorId.split('-');
  return parts.length >= 2 ? parts[0] : null;
};
export const getSenderField = get('senderField');
export const getDeliveryIdentifier = get('deliveryIdentifier');
export const getSenderName = get('name');