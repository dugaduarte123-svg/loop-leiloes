const HS_CHAT_PARAM = '#hs-chat-open';
const chatHashUrlRegex = new RegExp(HS_CHAT_PARAM, 'i');
export const urlHasHsChatHashLink = url => chatHashUrlRegex.test(url);