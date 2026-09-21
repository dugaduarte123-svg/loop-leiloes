import { combineReducers } from 'redux';
import { pubSubClient } from 'conversations-internal-pub-sub/redux/reducers/pubSubClient';
import { subscriptions } from 'conversations-internal-pub-sub/redux/reducers/subscriptions';

// @ts-ignore Untyped Import
import widgetData from '../widget-data/reducers/widgetData';
import visitorIdentity from '../visitor-identity/reducers/visitorIdentity';
import widgetUi from '../widget-ui/reducers/widgetUi';
// @ts-ignore Untyped Import
import emailCapture from '../email-capture/emailCaptureReducer';
// @ts-ignore Untyped Import
import availabilityMessageTimeouts from '../availability/reducers/availabilityMessageTimeouts';
import availabilityAutoReplyMessageTimeouts from '../availability/reducers/availabilityAutoReplyMessageTimeouts';
// @ts-ignore Untyped Import
import responders from '../responders/reducers/responders';
// @ts-ignore Untyped Import
import visitorThreadHistories from '../thread-histories/reducers/visitorThreadHistories';
// @ts-ignore Untyped Import
import typingStates from '../typing-indicators/reducers/typingStatesReducer';
// @ts-ignore Untyped Import
import fileUploads from '../file-uploads/reducers/fileUploads';
// @ts-ignore Untyped Import
import fileUploadsErrors from '../file-uploads/reducers/fileUploadsErrors';
import gdpr from '../gdpr/reducers/gdpr';
// @ts-ignore Untyped Import
import currentView from '../current-view/reducers/currentView';
import initialMessageBubbleVisible from '../initial-message-bubble/reducers/initialMessageBubbleVisible';
// @ts-ignore Untyped Import
import timeOnPageTrigger from '../time-on-page-trigger/reducers/timeOnPageTrigger';
// @ts-ignore Untyped Import
import threads from '../threads/reducers/threads';
import cookieBannerOnExitVisible from '../visitor-identity/reducers/cookieBannerOnExitVisible';
import visitorIdentification from '../visitor-identity/reducers/visitorIdentificationSlice';
// @ts-ignore Untyped Import
import selectedThreadId from '../selected-thread/reducers/selectedThreadId';
import unpublishedMessages from '../pubsub/reducers/unpublishedMessages';
import rejectedMessages from '../pubsub/reducers/rejectedMessagesSlice';
import { stagedThread } from '../thread-create/reducers/stagedThread';
import widgetInputFocusStatus from '../visitor-widget/reducers/widgetInputFocusStatus';
import { speechPocReducer } from './speechPocReducer';

// Migrated to Redux Toolkit
import messageEditorStaging from '../message-editor/reducers/messageEditorStaging';
import feedbackSurveyEnabled from '../feedback-survey/feedbackSurveyEnabledSlice';
import widgetSize from '../widget-size/widgetSizeSlice';
import clientData from '../client-data/reducers/clientData';
import kbArticle from '../kb-article/kbArticleSlice';
import kbLibrary from '../knowledge-base/reducers/kbLibrarySlice';
import typingIndicatorStyle from '../typing-indicators/typingIndicatorStyle';
import entryUrlMetadata from '../thread-create/reducers/entryUrlMetadataSlice';
import aiPromptsInteraction from '../ai-prompt-recommendations/reducers/aiPromptsInteractionSlice';
import standalonePromptRecommendations from '../ai-prompt-recommendations/reducers/standaloneRecommendedQuestionsSlice';
import newMessagePreviewPopup from '../spotlight/message-preview/reducers/newMessagePreviewPopupSlice';
import interactiveCards from '../interactive-cards/slice/interactiveCardsSlice';
import spotlightLayout from '../spotlight/layout/spotlightLayoutSlice';
export default combineReducers({
  typingStates,
  typingIndicatorStyle,
  availabilityMessageTimeouts,
  availabilityAutoReplyMessageTimeouts,
  clientData,
  cookieBannerOnExitVisible,
  currentView,
  emailCapture,
  fileUploads,
  fileUploadsErrors,
  gdpr,
  initialMessageBubbleVisible,
  kbArticle,
  messageEditorStaging,
  pubSubClient,
  responders,
  selectedThreadId,
  speechPoc: speechPocReducer,
  stagedThread,
  subscriptions,
  threadHistories: visitorThreadHistories,
  threads,
  timeOnPageTrigger,
  unpublishedMessages,
  rejectedMessages,
  visitorIdentity,
  widgetData,
  widgetInputFocusStatus,
  widgetUi,
  feedbackSurveyEnabled,
  visitorIdentification,
  widgetSize,
  kbLibrary,
  entryUrlMetadata,
  aiPromptsInteraction,
  standalonePromptRecommendations,
  newMessagePreviewPopup,
  interactiveCards,
  spotlightLayout
});