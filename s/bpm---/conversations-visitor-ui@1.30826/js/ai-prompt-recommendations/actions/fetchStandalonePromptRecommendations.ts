import { createAsyncThunk } from '@reduxjs/toolkit';
import Raven from 'raven-js';
import { UNINITIALIZED } from 'conversations-internal-schema/constants/RequestStatusTypes';
import { fetchPromptRecommendations } from '../clients/fetchPromptRecommendations';
import { getMessagesPageUri } from '../../selectors/widgetDataSelectors/getMessagesPageUri';
import { getIsMobile } from '../../selectors/getIsMobile';
import { getMessagesUtk } from '../../query-params/getMessagesUtk';
import { getHubspotUtk } from '../../query-params/hubspotUtk';
import { getHSTC } from '../../query-params/getHSTC';
export const fetchStandalonePromptRecommendations = createAsyncThunk('standalonePromptRecommendations/fetch', async (_, {
  getState
}) => {
  const state = getState();
  const messagesPageUri = getMessagesPageUri(state) || '';
  const mobile = getIsMobile(state);
  try {
    const response = await fetchPromptRecommendations({
      messagesPageUri,
      messagesUtk: getMessagesUtk(),
      hubspotUtk: getHubspotUtk(),
      hstc: getHSTC(),
      mobile,
      referrer: document.referrer
    });
    return (response === null || response === void 0 ? void 0 : response.recommendedQuestions) || [];
  } catch (error) {
    Raven.captureException(error);
    throw error;
  }
}, {
  condition: (_, {
    getState
  }) => {
    const {
      status
    } = getState().standalonePromptRecommendations;
    return status === UNINITIALIZED;
  }
});