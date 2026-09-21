'use es6';

import {
    Record
} from 'immutable';
import {
    CRM_OBJECT_LIFECYCLE_UPDATE
} from '../constants/messageTypes';
import {
    buildCrmObjectLifecycleUpdateMetadata
} from '../operators/buildCrmObjectLifecycleUpdateMetadata';
export default class CrmObjectLifecycleUpdate extends Record({
    '@type': CRM_OBJECT_LIFECYCLE_UPDATE,
    id: null,
    objectType: null,
    objectId: null,
    objectName: null,
    source: null,
    sourceId: null,
    crmObjectUpdate: null,
    timestamp: null
}, 'CrmObjectLifecycleUpdate') {
    constructor(properties = {}) {
        super(Object.assign({}, properties, {
            crmObjectUpdate: buildCrmObjectLifecycleUpdateMetadata(properties.objectType, properties.crmObjectUpdate)
        }));
    }
}