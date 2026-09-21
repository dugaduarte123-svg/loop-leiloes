import { useDetachedWindow } from 'conversations-visitor-experience-components/contexts/DetachedWindowContext';
export function useDetachedLayoutBehavior() {
  const {
    isDetachedWindow,
    isDetached,
    detachedWindowError,
    closeDetachedWindow,
    focusDetachedWindow,
    clearDetachedWindowError
  } = useDetachedWindow();
  const isHostingPopup = isDetached && !isDetachedWindow;
  const resolveWidgetOpenWithDetach = isOpen => isDetachedWindow || isOpen;
  const resolveLauncherHiddenWithDetach = base => {
    if (isDetachedWindow) return true;
    if (isDetached) return false;
    return base;
  };
  return {
    isDetached,
    isHostingPopup,
    detachedWindowError,
    focusDetachedWindow,
    closeDetachedWindow,
    clearDetachedWindowError,
    resolveWidgetOpenWithDetach,
    resolveLauncherHiddenWithDetach
  };
}