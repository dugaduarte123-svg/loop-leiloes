// @ts-ignore not typed
import { isCloseThreadMessage } from 'conversations-message-history/thread-status-update/operators/isCloseThreadMessage';
// @ts-ignore not typed
import { isOpenThreadMessage } from 'conversations-message-history/thread-status-update/operators/isOpenThreadMessage';
// @ts-ignore not typed
import { isContactAssociationMessage } from 'conversations-message-history/contact-association-message/operators/isContactAssociationMessage';
import { isTypingMessage } from 'conversations-message-history/typing-indicator/operators/isTypingMessage';
// @ts-ignore not typed
import { isCrmObjectLifecycleUpdate } from 'conversations-message-history/crm-object-lifecycle-update/operators/isCrmObjectLifecycleUpdate';
// @ts-ignore not typed
import { isCommonMessageFormat } from 'conversations-message-history/common-message-format/operators/cmfComparators';
import { deserialize } from 'conversations-message-history/common-message/serializers/messageSerializer';
import { assignmentV2MessageReceived } from '../../actions/assignmentV2MessageReceived';
import { clearTypingOnHandoff } from '../../typing-indicators/actions/clearTypingOnHandoff';
import { defaultMessageReceived } from '../../actions/defaultMessageReceived';
import { getThreadByThreadId } from '../../threads/selectors/getThreadByThreadId';
// @ts-ignore not typed
import { dismissTypingIndicator } from '../../typing-indicators/actions/dismissTypingIndicator';
// @ts-ignore not typed
import { typingMessageReceived } from '../../typing-indicators/actions/typingMessageReceived';
// @ts-ignore not typed
import { closeThreadMessageReceived } from './closeThreadMessageReceived';
import { openThreadMessageReceived } from './openThreadMessageReceived';
// @ts-ignore not typed
import { channelChangeReceived } from './changeChannelReceived';
import { genericChannelChangeReceived } from './genericChannelChangeReceived';
import { ChannelChange, CHANNEL_CHANGE } from 'conversations-internal-pub-sub/channel-change/records/ChannelChange';
// @ts-ignore not typed
import { getType } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
// @ts-ignore not typed
import { onContactAssociated } from './onContactAssociated';
// @ts-ignore not typed
import { validateMessageClientType } from '../util/validateMessageClientType';
// @ts-ignore not typed
import { isAssignmentUpdateMessage } from 'conversations-message-history/assignment-update-message/operators/isAssignmentUpdateMessage';
import { isPartialMessage } from 'conversations-message-history/partial-message/operators/isPartialMessage';
import { partialMessageReceived } from './partialMessageReceived';
import { rejectedMessageReceived } from './rejectedMessageReceived';
import { isRejectedMessage } from 'conversations-message-history/message-rejected/operators/isRejectedMessage';
import { INTERACTIVE_CARD } from 'conversations-message-history/common-message-format/constants/attachmentTypes';
import { getAttachmentWithType } from 'conversations-message-history/common-message-format/operators/commonMessageGetters';
import { isInteractiveCardResponseMessage } from 'conversations-message-history/interactive-card-response-message/operators/isInteractiveCardResponseMessage';
import { resolveInteractiveCardForMessage } from '../../interactive-cards/actions/resolveInteractiveCardForMessage';
import { interactiveCardResponseReceived } from '../../interactive-cards/actions/interactiveCardResponseReceived';
import { emitEmailCapturedFromVisitorMessages } from '../../email-capture/actions/emitEmailCapturedFromVisitorMessages';
import Raven from 'raven-js';
export const onMessageReceived = ({
  threadId,
  message: pubSubMessage,
  channel,
  publishContext = {}
}) => (dispatch, getState) => {
  const {
    data: messageJson,
    clientId
  } = pubSubMessage;
  const thread = getThreadByThreadId(getState(), {
    threadId
  });

  // TODO: Remove this hardcoded string and move it to a shared constant
  if (getType(messageJson) === 'GENERIC_CHANNEL_CHANGE' || getType(messageJson) === 'THREAD_PAUSED_ON_GENERIC_CHANNEL' && messageJson.isPausedOn === 1000) {
    dispatch(genericChannelChangeReceived({
      threadId
    }));
    return;
  }
  if (getType(messageJson) === CHANNEL_CHANGE) {
    dispatch(channelChangeReceived({
      channelChange: new ChannelChange(messageJson),
      threadId
    }));
    return;
  }
  const message = deserialize({
    json: messageJson
  });
  try {
    validateMessageClientType({
      message,
      clientId
    });
  } catch (error) {
    Raven.captureException(error, {
      extra: {
        threadId,
        clientId,
        channel
      }
    });
    return;
  }
  switch (true) {
    case isPartialMessage(message):
      {
        dispatch(dismissTypingIndicator(message, threadId));
        dispatch(partialMessageReceived({
          message,
          channel,
          threadId,
          publishContext
        }));
        break;
      }
    case isCrmObjectLifecycleUpdate(message):
      {
        // NOOP
        break;
      }
    case isCommonMessageFormat(message):
      {
        dispatch(dismissTypingIndicator(message, threadId));
        dispatch(defaultMessageReceived(message, channel, threadId, publishContext));
        const cardAttachment = getAttachmentWithType(INTERACTIVE_CARD, message);
        const cardInstanceId = cardAttachment === null || cardAttachment === void 0 ? void 0 : cardAttachment.get('cardInstanceId');
        if (cardInstanceId) {
          void dispatch(resolveInteractiveCardForMessage({
            cardInstanceId,
            threadId
          }));
        }
        break;
      }
    case isAssignmentUpdateMessage(message):
      {
        dispatch(clearTypingOnHandoff(message, threadId));
        dispatch(assignmentV2MessageReceived(message, channel, threadId));
        break;
      }
    case isContactAssociationMessage(message):
      {
        onContactAssociated();
        emitEmailCapturedFromVisitorMessages(getState, threadId);
        break;
      }
    case isTypingMessage(message):
      {
        if (!publishContext.playback) dispatch(typingMessageReceived(message, threadId));
        break;
      }
    case isRejectedMessage(message):
      {
        dispatch(rejectedMessageReceived({
          message,
          channel,
          threadId
        }));
        break;
      }
    case isCloseThreadMessage(message):
      {
        Raven.captureMessage('close-thread-message-received', {
          level: 'info',
          extra: {
            threadId,
            channel
          }
        });
        dispatch(closeThreadMessageReceived({
          message,
          thread,
          channel
        }));
        break;
      }
    case isOpenThreadMessage(message):
      {
        dispatch(openThreadMessageReceived({
          message,
          channel,
          threadId
        }));
        break;
      }
    case isInteractiveCardResponseMessage(message):
      {
        dispatch(interactiveCardResponseReceived(message));
        break;
      }
    default:
      {
        dispatch(defaultMessageReceived(message, channel, threadId, publishContext));
      }
  }
};