// @ts-ignore untyped module
import EmailAddressPattern from 'PatternValidationJS/patterns/EmailAddress';
import { INCOMING } from 'conversations-message-history/common-message-format/constants/messageDirections';
import { getMessages } from 'conversations-message-history/thread-history/operators/getters';
import { getThreadByThreadId } from '../../threads/selectors/getThreadByThreadId';
// @ts-ignore untyped module
import { historyDataForThread } from '../../thread-histories/selectors/historyDataForThread';
import { postEmailCapturedEvent } from './postEmailCapturedEvent';
import { getHasVisitorEmail } from '../../selectors/widgetDataSelectors/getHasVisitorEmail';
export const emitEmailCapturedFromVisitorMessages = (getState, threadId) => {
  const state = getState();
  if (getHasVisitorEmail(state)) return;
  const thread = getThreadByThreadId(state, {
    threadId
  });
  if (!thread) return;
  const historyData = historyDataForThread(state, {
    thread
  });
  if (!historyData) return;
  const messages = getMessages(historyData);
  if (!messages) return;
  const emailMessage = messages.findLast(msg => msg.get('direction') === INCOMING && EmailAddressPattern.test(msg.get('text') || ''));
  if (emailMessage) {
    postEmailCapturedEvent({
      email: emailMessage.get('text')
    });
  }
};