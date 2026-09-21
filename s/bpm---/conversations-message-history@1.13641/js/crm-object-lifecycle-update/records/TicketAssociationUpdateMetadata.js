'use es6';

import {
    Record
} from 'immutable';
import {
    UPDATE_TYPE
} from '../constants/keyPaths';
const TicketAssociationUpdateMetadata = Record({
    [UPDATE_TYPE]: null,
    toObjectType: null,
    toObjectId: null,
    toObjectName: null,
    updateType: null,
    auditParams: null
}, 'TicketAssociationUpdateMetadata');
export default TicketAssociationUpdateMetadata;