import { expandIframeToViewportForDrag } from '../post-message/handleIframeResize';
const CHAT_WINDOW_CLASS = '.chat-widget';
export const createResizeDragHandler = ({
  wrapperRef,
  isDraggingRef,
  setIsResizing,
  defaultWidgetSize,
  browserWindowWidth,
  browserWindowHeight,
  computeNewSize,
  applyCSSUpdate,
  hasChanged,
  onSizeCommitted,
  onSizeTracked
}) => {
  return event => {
    var _wrapperRef$current, _chatWindowEl$offsetW, _chatWindowEl$offsetH;
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);
    const chatWindowEl = (_wrapperRef$current = wrapperRef.current) === null || _wrapperRef$current === void 0 ? void 0 : _wrapperRef$current.querySelector(CHAT_WINDOW_CLASS);
    const start = {
      startWidth: (_chatWindowEl$offsetW = chatWindowEl === null || chatWindowEl === void 0 ? void 0 : chatWindowEl.offsetWidth) !== null && _chatWindowEl$offsetW !== void 0 ? _chatWindowEl$offsetW : defaultWidgetSize.width,
      startHeight: (_chatWindowEl$offsetH = chatWindowEl === null || chatWindowEl === void 0 ? void 0 : chatWindowEl.offsetHeight) !== null && _chatWindowEl$offsetH !== void 0 ? _chatWindowEl$offsetH : defaultWidgetSize.height,
      startX: event.screenX,
      startY: event.screenY
    };
    isDraggingRef.current = true;
    setIsResizing(true);
    expandIframeToViewportForDrag({
      width: browserWindowWidth,
      height: browserWindowHeight
    });
    let lastScreenX = event.screenX;
    let lastScreenY = event.screenY;
    const onPointerMove = ev => {
      lastScreenX = ev.screenX;
      lastScreenY = ev.screenY;
      const newSize = computeNewSize(start, ev.screenX, ev.screenY);
      if (wrapperRef.current) {
        applyCSSUpdate(wrapperRef.current, newSize);
      }
    };
    const onPointerEnd = ev => {
      target.removeEventListener('pointermove', onPointerMove);
      target.removeEventListener('pointerup', onPointerEnd);
      target.removeEventListener('pointercancel', onPointerEnd);
      target.removeEventListener('lostpointercapture', onPointerEnd);
      if (target.hasPointerCapture(ev.pointerId)) {
        target.releasePointerCapture(ev.pointerId);
      }
      const resolvedX = ev.type === 'lostpointercapture' ? lastScreenX : ev.screenX;
      const resolvedY = ev.type === 'lostpointercapture' ? lastScreenY : ev.screenY;
      const finalSize = computeNewSize(start, resolvedX, resolvedY);
      isDraggingRef.current = false;
      setIsResizing(false);
      onSizeCommitted(finalSize);
      if (ev.type !== 'pointercancel' && hasChanged(finalSize, start)) {
        onSizeTracked(finalSize);
      }
    };
    target.addEventListener('pointermove', onPointerMove);
    target.addEventListener('pointerup', onPointerEnd);
    target.addEventListener('pointercancel', onPointerEnd);
    target.addEventListener('lostpointercapture', onPointerEnd);
  };
};