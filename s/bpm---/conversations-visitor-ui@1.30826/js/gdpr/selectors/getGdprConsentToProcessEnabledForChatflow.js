'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    gdprConsentToProcessEnabled
} from 'conversations-internal-schema/widget-data/operators/gdprConsentToProcessEnabled';
import {
    getLatestWidgetData
} from '../../widget-data/selectors/getLatestWidgetData';
export const getGdprConsentToProcessEnabledForChatflow = createSelector([getLatestWidgetData], widgetData => gdprConsentToProcessEnabled(widgetData));