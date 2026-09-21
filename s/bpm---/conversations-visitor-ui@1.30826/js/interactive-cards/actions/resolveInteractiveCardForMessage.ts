import Raven from 'raven-js';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchInteractiveCardInstance } from '../../clients/fetchInteractiveCardInstance';
import { getSessionId } from '../../selectors/widgetDataSelectors/getSessionId';
import { getInteractiveCardByInstanceId } from '../selectors/getInteractiveCardByInstanceId';
import { parseCardInstanceResponse } from '../operators/parseCardInstanceResponse';
export const resolveInteractiveCardForMessage = createAsyncThunk('interactiveCards/resolve', async ({
  cardInstanceId,
  threadId
}, {
  getState
}) => {
  const sessionId = getSessionId(getState());
  try {
    const cardInstance = await fetchInteractiveCardInstance({
      cardInstanceId,
      sessionId
    });
    return Object.assign({
      cardInstanceId,
      threadId,
      cardId: cardInstance.cardId
    }, parseCardInstanceResponse(cardInstance));
  } catch (error) {
    Raven.captureException(error);
    throw error;
  }
}, {
  condition: ({
    cardInstanceId
  }, {
    getState
  }) => {
    const state = getState();
    if (!getSessionId(state)) return false;
    return !getInteractiveCardByInstanceId(state, cardInstanceId);
  }
});