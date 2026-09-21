export const resolveBuilder = () => {
  return import( /* webpackChunkName: "conversations-internal-pub-sub-client-builder" */
  'conversations-internal-pub-sub/conversations-pub-sub/builders/buildConversationsPubSub');
};