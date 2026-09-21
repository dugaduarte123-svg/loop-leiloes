import { urlHasHsChatHashLink } from '../utils/urlHasHsChatHashLink';
export const registerHashChangeListener = ({
  requestWidgetOpen,
  isOpen
}) => {
  window.addEventListener('hashchange', () => {
    if (urlHasHsChatHashLink(window.location.href) && !isOpen) {
      requestWidgetOpen();
    }
  });
};