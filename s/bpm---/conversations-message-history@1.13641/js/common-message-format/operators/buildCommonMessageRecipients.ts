import { List } from 'immutable';
import curry from 'transmute/curry';
import get from 'transmute/get';
import { HS_EMAIL_ADDRESS, CHANNEL_SPECIFIC_OPAQUE_ID } from '../constants/deliveryIdentifierTypes';
import Recipient from '../records/Recipient';

// not adding a dep for just this type, but would be
// import EmailAddressRecord from 'customer-data-email/schema/email/EmailAddressRecord';
export const buildEmailRecipientWithField = curry((recipientField, listOfAddresses) => {
  return listOfAddresses.map(recipient => {
    const address = get('address', recipient);
    return Recipient({
      actorId: null,
      recipientField,
      deliveryIdentifier: {
        type: HS_EMAIL_ADDRESS,
        value: address
      }
    });
  }).toList();
});
export const buildTORecipients = buildEmailRecipientWithField('TO');
export const buildCCRecipients = buildEmailRecipientWithField('CC');
export const buildBCCRecipients = buildEmailRecipientWithField('BCC');
export const buildInitialEmailRecipients = ({
  to,
  cc,
  bcc
}) => {
  return buildTORecipients(to).concat(buildCCRecipients(cc), buildBCCRecipients(bcc));
};
export const buildContactRecipients = ({
  type,
  value,
  vid
}) => {
  return List([Recipient({
    actorId: vid ? `V-${vid}` : null,
    deliveryIdentifier: {
      type: type || CHANNEL_SPECIFIC_OPAQUE_ID,
      value: `${value || vid}`
    },
    recipientField: null
  })]);
};