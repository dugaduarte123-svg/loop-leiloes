'use es6';

import getIn from 'transmute/getIn';
import {
    PIPELINE_ID,
    PIPELINE_NAME,
    PIPELINE_STAGE,
    PIPELINE_STAGE_ID,
    PREVIOUS_PIPELINE_STAGE,
    UPDATE_TYPE
} from '../constants/keyPaths';
export const getUpdateType = getIn(UPDATE_TYPE);
export const getPipelineId = getIn(PIPELINE_ID);
export const getPipelineName = getIn(PIPELINE_NAME);
export const getPipelineStageId = getIn(PIPELINE_STAGE_ID);
export const getPipelineStage = getIn(PIPELINE_STAGE);
export const getPreviousPipelineStage = getIn(PREVIOUS_PIPELINE_STAGE);