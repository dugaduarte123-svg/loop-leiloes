'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    getLatestWidgetData
} from '../../widget-data/selectors/getLatestWidgetData';
export const getMessageId = createSelector([getLatestWidgetData], widgetData => {
    return widgetData.message.id;
});