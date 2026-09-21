'use es6';

import {
    fromJS,
    Map as ImmutableMap
} from 'immutable';
import get from 'transmute/get';
import {
    buildAttachments
} from '../../common-message-format/operators/buildAttachments';
import Status from '../../common-message-format/records/Status';
import {
    generateUuid
} from '../../util/generateUuid';
import {
    generateUniqueClientTimestamp
} from '../../util/timestamps';
import InitialMessage from '../records/InitialMessage';
export const buildInitialMessage = (props = {}) => {
    const timestamp = get('timestamp', props);
    return InitialMessage({
        id: get('id', props) || generateUuid(),
        sender: ImmutableMap(fromJS(get('sender', props))),
        status: Status(get('status', props)),
        attachments: buildAttachments(get('attachments', props)),
        clientType: get('clientType', props),
        richText: get('richText', props),
        text: get('text', props),
        timestamp: timestamp || generateUniqueClientTimestamp(),
        senders: get('senders', props),
        channelInstanceId: get('channelInstanceId', props),
        recipients: get('recipients', props)
    });
};