import { createContext, useCallback, useContext, useState } from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
const WidgetModalContext = /*#__PURE__*/createContext(undefined);
function useWidgetModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState();
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalContent(undefined);
  }, []);
  const openModal = useCallback(newModalContent => {
    setIsOpen(true);
    setModalContent(newModalContent);
  }, []);
  return {
    closeModal,
    isOpen,
    modalContent,
    openModal
  };
}
export const WidgetModalProvider = ({
  children
}) => {
  const modalState = useWidgetModal();
  return /*#__PURE__*/_jsx(WidgetModalContext.Provider, {
    value: {
      isOpen: modalState.isOpen,
      modalContent: modalState.modalContent,
      openModal: modalState.openModal,
      closeModal: modalState.closeModal
    },
    children: children
  });
};
WidgetModalProvider.displayName = 'WidgetModalProvider';
export const useWidgetModalOrContext = () => {
  const context = useContext(WidgetModalContext);
  const fallbackModal = useWidgetModal();

  // Use context if available, otherwise fall back to direct hook
  return context || fallbackModal;
};
useWidgetModalOrContext.displayName = 'useWidgetModalOrContext';