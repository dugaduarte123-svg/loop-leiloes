import { createContext, useContext } from 'react';
const ChatWidgetLocaleContext = /*#__PURE__*/createContext(undefined);
export const ChatWidgetLocaleContextConsumer = ChatWidgetLocaleContext.Consumer;
export const ChatWidgetLocaleContextProvider = ChatWidgetLocaleContext.Provider;
export const useChatWidgetLocale = () => useContext(ChatWidgetLocaleContext);