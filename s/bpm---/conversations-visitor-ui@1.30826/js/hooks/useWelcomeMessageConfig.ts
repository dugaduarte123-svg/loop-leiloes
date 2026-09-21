import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import { getMessageResultsFromStagedThread } from '../quick-reply/operators/getMessageResultsFromStagedThread';
import getQuickReplyOptionsFromStagedThreadMessages from '../quick-reply/operators/getQuickReplyOptionsFromStagedThreadMessages';
import { showQuickReplyOutsideChat } from '../utils/showQuickRepliesOutsideChat';
import { selectQuickReplyOptionOutsideChat } from '../actions/selectQuickReplyOptionOutsideChat';
import { getColoring } from '../selectors/widgetDataSelectors/getColoring';
import { useConsentPromptDataV2 } from './useConsentPromptDataV2';
import { getIsAIChatbot } from '../selectors/widgetDataSelectors/getIsAIChatbot';
const EMPTY_QUICK_REPLIES = ImmutableOrderedSet();
export const useWelcomeMessageConfig = () => {
  const dispatch = useDispatch();
  const {
    shouldHideQuickReplies,
    showConsentButton,
    consentMessage,
    consentRequired,
    spamProtectionEnabled,
    handleConsentAccept
  } = useConsentPromptDataV2();
  const isAIChatBot = useSelector(getIsAIChatbot);
  const messageResults = useSelector(getMessageResultsFromStagedThread);
  const quickReplyOptions = getQuickReplyOptionsFromStagedThreadMessages(messageResults);
  const displayBotQuickRepliesOutsideChat = useSelector(showQuickReplyOutsideChat);
  const widgetColoring = useSelector(getColoring);
  const handleQuickReplyClick = useCallback((text, quickReply) => {
    dispatch(selectQuickReplyOptionOutsideChat(text, quickReply));
  }, [dispatch]);
  const hasQuickReplies = displayBotQuickRepliesOutsideChat && quickReplyOptions.size > 0;
  const shouldShowConsentPrompt = hasQuickReplies && consentRequired;
  const showFooterContent = shouldShowConsentPrompt || spamProtectionEnabled;
  const quickRepliesConfig = useMemo(() => {
    if (!hasQuickReplies) {
      return undefined;
    }
    return {
      quickReplyOptions: shouldHideQuickReplies ? EMPTY_QUICK_REPLIES : quickReplyOptions,
      onQuickReplyClick: handleQuickReplyClick,
      accentColor: widgetColoring === null || widgetColoring === void 0 ? void 0 : widgetColoring.accentColor,
      hasQuickReplies: true
    };
  }, [hasQuickReplies, shouldHideQuickReplies, quickReplyOptions, handleQuickReplyClick, widgetColoring]);
  const consentConfig = useMemo(() => {
    if (!showFooterContent) {
      return undefined;
    }
    return {
      consentMessage: shouldShowConsentPrompt ? consentMessage : '',
      consentRequired: shouldShowConsentPrompt,
      showConsentButton: shouldShowConsentPrompt && showConsentButton,
      onConsentAccept: handleConsentAccept,
      showSpamProtection: spamProtectionEnabled,
      accentColor: widgetColoring.accentColor,
      isAIChatBot
    };
  }, [showFooterContent, consentMessage, shouldShowConsentPrompt, showConsentButton, handleConsentAccept, spamProtectionEnabled, widgetColoring, isAIChatBot]);
  return {
    showQuickReplies: hasQuickReplies,
    quickRepliesConfig,
    consentConfig
  };
};