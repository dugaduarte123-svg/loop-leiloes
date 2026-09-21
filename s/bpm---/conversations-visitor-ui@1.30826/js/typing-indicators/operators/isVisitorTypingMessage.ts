// @ts-ignore Untyped import
import { isFromVisitor } from 'conversations-message-history/common-message-format/operators/senderTypeComparators';
import { isTypingMessage } from 'conversations-message-history/typing-indicator/operators/isTypingMessage';
// @ts-ignore Untyped import

export const isVisitorTypingMessage = message => Boolean(isTypingMessage(message) && isFromVisitor(message));