import { useSelector } from 'react-redux';
import { getChatHeadingConfig } from '../chat-heading-config/selectors/getChatHeadingConfig';
// @ts-ignore Untyped import
import { getChatHeadingResponders } from '../responders/selectors/getChatHeadingResponders';
export const useWelcomeMessageAvatarsData = () => {
  const chatHeadingConfig = useSelector(getChatHeadingConfig);
  const chatHeadingResponders = useSelector(getChatHeadingResponders);
  return {
    chatHeadingConfig,
    chatHeadingResponders
  };
};