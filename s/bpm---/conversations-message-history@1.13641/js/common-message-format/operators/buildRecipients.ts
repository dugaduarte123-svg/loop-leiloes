import { List as ImmutableList } from 'immutable';
import Recipient from '../records/Recipient';
export const buildRecipients = (recipients = []) => {
  return recipients.reduce((recipientList, recipient) => {
    return recipientList.push(Recipient(recipient));
  }, ImmutableList());
};