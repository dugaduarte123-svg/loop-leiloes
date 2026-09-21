'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    gdprConsentToProcessEnabled
} from 'conversations-internal-schema/widget-data/operators/gdprConsentToProcessEnabled';
import {
    gdprExplicitConsentRequired
} from 'conversations-internal-schema/widget-data/operators/gdprExplicitConsentRequired';
import {
    getLatestWidgetData
} from '../../widget-data/selectors/getLatestWidgetData';
import {
    getUserHasGivenConsentToProcess
} from './getHasUserGivenConsentToProcess';
export const shouldRecordImplicitConsentToProcess = createSelector([getLatestWidgetData, getUserHasGivenConsentToProcess], (widgetData, userHasGivenConsentToProcess) => {
    return gdprConsentToProcessEnabled(widgetData) && !gdprExplicitConsentRequired(widgetData) && !userHasGivenConsentToProcess;
});