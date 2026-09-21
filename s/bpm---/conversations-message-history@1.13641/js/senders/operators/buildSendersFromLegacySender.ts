import { reportError } from 'conversations-error-reporting/error-reporting/reportError';
import { fromJS, List as ImmutableList } from 'immutable';
import get from 'transmute/get';
import pipe from 'transmute/pipe';
import set from 'transmute/set';
import Sender from '../../common-message-format/records/Sender';
function buildGenericFromLegacySender(legacySender) {
  const type = get('@type', legacySender) || get('type', legacySender);
  const id = get('utk', legacySender) || get('vid', legacySender) || get('id', legacySender);
  if (!type || !id) {
    return null;
  }
  return Sender({
    actorId: `${type && type[0]}-${id}`
  });
}
export function buildSendersFromLegacySender(props) {
  try {
    const senderProp = get('sender', props);
    const sender = fromJS(senderProp || {});
    const genericSenderFromLegacy = buildGenericFromLegacySender(sender);
    const sendersProp = get('senders', props) || [];
    const sendersFromProp = ImmutableList(sendersProp.filter(Boolean).map(genericSender => Sender(genericSender)));
    const senders = sendersFromProp.size === 0 && genericSenderFromLegacy ? ImmutableList([genericSenderFromLegacy]) : sendersFromProp;
    return pipe(set('sender', sender), set('senders', senders))(props);
  } catch (e) {
    const error = new Error(`Unable to build Senders from legacy Sender`);
    reportError({
      error,
      extra: {
        message: `${e}`
      }
    });
    return props;
  }
}