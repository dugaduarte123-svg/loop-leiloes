export const createReplyRecsHistoryEntry = replyRecommendations => {
  const replyRecommendationsHistory = {};
  if (replyRecommendations) {
    const [replyRecommendation] = replyRecommendations || [];
    const {
      inResponseToMessageId
    } = replyRecommendation || {};
    replyRecommendationsHistory[inResponseToMessageId] = replyRecommendations;
  }
  return replyRecommendationsHistory;
};