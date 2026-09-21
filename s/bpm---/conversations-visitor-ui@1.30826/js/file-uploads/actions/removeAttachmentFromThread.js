'use es6';

import {
    getLocalId
} from 'conversations-internal-schema/file-upload/operators/fileUploadGetters';
import {
    trackInteraction
} from '../../usage-tracking/actions/trackInteraction';
import {
    EVENT_NAMES
} from '../../usage-tracking/constants/eventNames';
import {
    getThreadId
} from '../../threads/operators/threadGetters';
import {
    removeAttachment
} from '../../file-uploads/actions/removeAttachment';
export const removeAttachmentFromThread = ({
    attachment,
    thread
}) => dispatch => {
    const threadId = getThreadId(thread);
    const localId = getLocalId(attachment);
    dispatch(removeAttachment({
        localId,
        threadId
    }));
    dispatch(trackInteraction(EVENT_NAMES.WIDGET_INTERACTION, {
        action: 'remove staged attachment'
    }));
};