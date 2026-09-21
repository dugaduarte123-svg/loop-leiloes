'use es6';

import {
    Record,
    Map as ImmutableMap,
    fromJS
} from 'immutable';
import {
    CONTACT_ASSOCIATION
} from '../constants/messageTypes';
import {
    NOT_DELETED
} from '../../common-message-format/constants/messageDeleteStatus';
class ContactAssociationMessage extends Record({
    '@type': CONTACT_ASSOCIATION,
    id: null,
    timestamp: null,
    sender: ImmutableMap(),
    messageDeletedStatus: NOT_DELETED,
    clientType: null,
    newVid: null,
    newMessagesUtk: {
        empty: true,
        present: false
    },
    threadId: null
}, 'ContactAssociationMessage') {
    constructor(props = {}) {
        const map = fromJS(Object.assign({}, props)).filterNot(value => typeof value === 'undefined');
        super(map);
    }
}
export default ContactAssociationMessage;