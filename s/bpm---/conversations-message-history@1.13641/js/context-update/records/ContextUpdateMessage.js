'use es6';

import {
    fromJS,
    Map as ImmutableMap,
    Record
} from 'immutable';
import {
    NOT_DELETED
} from '../../common-message-format/constants/messageDeleteStatus';
import {
    CONTEXT_UPDATE
} from '../constants/messageTypes';
class ContextUpdateMessage extends Record({
    '@type': CONTEXT_UPDATE,
    id: null,
    timestamp: null,
    contexts: ImmutableMap(),
    hiddenFromVisitor: false,
    messageDeletedStatus: NOT_DELETED
}, 'ContextUpdateMessage') {
    constructor(options = {}) {
        super(Object.assign({}, options, {
            contexts: options.contexts && options.contexts ? fromJS(options.contexts) : ImmutableMap()
        }));
    }
}
export default ContextUpdateMessage;