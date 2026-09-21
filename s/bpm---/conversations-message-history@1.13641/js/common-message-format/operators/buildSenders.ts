import { List as ImmutableList } from 'immutable';
import reduce from 'transmute/reduce';
import Sender from '../records/Sender';
export const buildSenders = (senders = []) => {
  return reduce(ImmutableList(), (senderList, sender) => {
    return senderList.push(Sender(sender));
  }, ImmutableList(senders));
};