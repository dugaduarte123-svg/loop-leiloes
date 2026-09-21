'use es6';

import {
    Record
} from 'immutable';
import {
    UPDATE_TYPE
} from '../constants/keyPaths';
import CrmCreationSource from './CrmCreationSource';
class TicketUpdateMetadata extends Record({
    [UPDATE_TYPE]: null,
    pipelineId: null,
    pipelineName: null,
    pipelineStageId: null,
    pipelineStage: null,
    previousPipelineStageName: null,
    crmCreationSource: null
}, 'TicketUpdateMetadata') {
    constructor(properties = {}) {
        super(Object.assign({}, properties, {
            crmCreationSource: properties.crmCreationSource ? CrmCreationSource(properties.crmCreationSource) : null
        }));
    }
}
export default TicketUpdateMetadata;