import { createSelector } from '@reduxjs/toolkit';
import { getWelcomeMessage } from '../../selectors/widgetDataSelectors/getWelcomeMessage';
// @ts-ignore Untyped import
import { getChatHeadingConfig as getChatHeadingConfigOperator } from 'conversations-internal-schema/message/operators/messageGetters';
export const getChatHeadingConfig = createSelector(getWelcomeMessage, message => getChatHeadingConfigOperator(message));