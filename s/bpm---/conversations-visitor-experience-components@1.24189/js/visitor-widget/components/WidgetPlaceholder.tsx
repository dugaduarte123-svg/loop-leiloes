import VizExLoadingSpinner from 'visitor-ui-component-library/loading/VizExLoadingSpinner';
import styled from 'styled-components';
import { useDelayedRender } from '../util/useDelayedRender';
import { useDetachedWindow } from '../../contexts/DetachedWindowContext';
import { jsx as _jsx } from "react/jsx-runtime";
export const WidgetBodyDiv = styled.div.withConfig({
  displayName: "WidgetPlaceholder__WidgetBodyDiv"
})(["display:flex;flex-direction:column;height:", ";width:", ";align-items:center;justify-content:center;"], ({
  isDetached
}) => isDetached ? '100vh' : '100%', ({
  isDetached
}) => isDetached ? '100%' : 'auto');
const WidgetPlaceholder = () => {
  const {
    isDetached
  } = useDetachedWindow();
  const finished = useDelayedRender(200);
  return /*#__PURE__*/_jsx(WidgetBodyDiv, {
    isDetached: isDetached,
    "data-test-id": "chat-widget-wrapper",
    children: finished && /*#__PURE__*/_jsx(VizExLoadingSpinner, {
      size: "sm"
    })
  });
};
WidgetPlaceholder.displayName = 'WidgetPlaceholder';
export default WidgetPlaceholder;