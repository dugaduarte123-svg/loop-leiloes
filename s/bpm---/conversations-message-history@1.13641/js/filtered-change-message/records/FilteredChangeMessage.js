'use es6';

import {
    Record,
    fromJS,
    Map as ImmutableMap
} from 'immutable';
import {
    NOT_DELETED
} from '../../common-message-format/constants/messageDeleteStatus';
import {
    generateUniqueClientTimestamp
} from '../../util/timestamps';
import {
    generateUuid
} from '../../util/generateUuid';
import {
    FILTERED_CHANGE
} from '../constants/messageTypes';
import {
    buildAudit
} from '../../audit/operators/buildAudit';
class FilteredChangeMessage extends Record({
    '@type': FILTERED_CHANGE,
    id: null,
    timestamp: null,
    sender: ImmutableMap(),
    messageDeletedStatus: NOT_DELETED,
    auditParams: buildAudit(),
    filteredChangeInfo: ImmutableMap()
}, 'FilteredChangeMessage') {
    constructor(props = {}) {
        const map = fromJS(Object.assign({}, props, {
            id: props.id || generateUuid(),
            auditParams: buildAudit(props.auditParams),
            timestamp: props.timestamp || generateUniqueClientTimestamp('FilteredChangeMessage-timestamp')
        })).filterNot(value => typeof value === 'undefined');
        super(map);
    }
}
export default FilteredChangeMessage;