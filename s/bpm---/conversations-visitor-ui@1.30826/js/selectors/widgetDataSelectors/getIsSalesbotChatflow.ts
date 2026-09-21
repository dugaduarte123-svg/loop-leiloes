import { createSelector } from '@reduxjs/toolkit';
import { getChatflowName } from '../../widget-data/selectors/widgetDataSelectors';
import { getIsPortal53 } from '../../widget-data/operators/getIsPortal53';
const SALESBOT_CHATFLOW_NAME_REGEX = /Salesbot/i;
export const getIsSalesbotChatflow = createSelector(getChatflowName, chatflowName => getIsPortal53() && SALESBOT_CHATFLOW_NAME_REGEX.test(chatflowName !== null && chatflowName !== void 0 ? chatflowName : ''));