import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../buildStore';
// @ts-ignore untyped module
import { pubsubConnectionFailed } from '../../pubsub/selectors/pubsubConnectionFailed';
// @ts-ignore untyped module
import { canPublish } from '../../pubsub/selectors/canPublish';
import { getTypingMessageShouldDisableUserInput } from '../../typing-indicators/selectors/getTypingMessageShouldDisableUserInput';
import { getIsBlockedByUnansweredQuickReply } from '../../thread-histories/selectors/getIsBlockedByUnansweredQuickReply';
import { getVisitorCanSendMessage } from '../../availability/selectors/getVisitorCanSendMessage';
import { trackComposerDisabled } from '../utils/trackMetric';
const SETTLING_THRESHOLD_MS = 7000;
function getDisabledReason(isPubsubConnectionFailed, canPublishMessage, canSendMessage, isTypingDisabled, isQuickReplyBlocked) {
  if (!canSendMessage) return 'availability';
  if (isTypingDisabled) return 'typing-indicator';
  if (isQuickReplyBlocked) return 'quick-reply';
  if (isPubsubConnectionFailed) return 'pubsub-connection-failed';
  if (!canPublishMessage) return 'cannot-publish';
  return 'unknown';
}
export function useTrackComposerDisabledMetric(surface, isInputDisabled, enabled = true) {
  const isPubsubConnectionFailed = useAppSelector(pubsubConnectionFailed);
  const canPublishMessage = useAppSelector(canPublish);
  const isTypingDisabled = useAppSelector(getTypingMessageShouldDisableUserInput);
  const isQuickReplyBlocked = useAppSelector(getIsBlockedByUnansweredQuickReply);
  const canSendMessage = useAppSelector(getVisitorCanSendMessage);
  const reasonRef = useRef('unknown');
  reasonRef.current = getDisabledReason(isPubsubConnectionFailed, canPublishMessage, canSendMessage, isTypingDisabled, isQuickReplyBlocked);
  useEffect(() => {
    if (!isInputDisabled || !enabled) return;
    const reasonAtArm = reasonRef.current;
    const timer = setTimeout(() => {
      trackComposerDisabled(reasonAtArm, surface);
    }, SETTLING_THRESHOLD_MS);
    return () => clearTimeout(timer);
  }, [isInputDisabled, enabled, surface]);
}