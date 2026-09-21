'use es6';

import {
    Record,
    Map as ImmutableMap,
    fromJS,
    List
} from 'immutable';
import Status from '../../common-message-format/records/Status';
import {
    buildStatus
} from '../../common-message-format/operators/buildStatus';
import {
    OFFICE_HOURS
} from '../constants/messageTypes';
import {
    NOT_DELETED
} from '../../common-message-format/constants/messageDeleteStatus';
import {
    generateUniqueClientTimestamp
} from '../../util/timestamps';
import {
    generateUuid
} from '../../util/generateUuid';
class OfficeHoursMessage extends Record({
    '@type': OFFICE_HOURS,
    id: null,
    text: '',
    officeHoursStartTime: null,
    timestamp: null,
    sender: ImmutableMap(),
    status: Status(),
    messageDeletedStatus: NOT_DELETED,
    direction: '',
    senders: List(),
    recipients: List(),
    genericChannelId: null,
    channelInstanceId: null
}, 'OfficeHoursMessage') {
    constructor(props = {}) {
        const map = fromJS(Object.assign({}, props, {
            id: props.id || generateUuid(),
            status: buildStatus(props.status),
            timestamp: props.timestamp || generateUniqueClientTimestamp('OfficeHoursMessage-timestamp')
        })).filterNot(value => typeof value === 'undefined');
        super(map);
    }
}
export default OfficeHoursMessage;