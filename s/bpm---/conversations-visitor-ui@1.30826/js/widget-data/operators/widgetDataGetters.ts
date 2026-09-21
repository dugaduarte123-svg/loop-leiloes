/*  @ts-ignore Jun-7-2024, 18:2UTC FixMe: Complete Migration to TypeScript  */

import getIn from 'transmute/getIn';
export const getChatflowName = widgetData => getIn(['message', 'name'], widgetData);