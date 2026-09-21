import { useCustomerAgentHover } from '../../contexts/CustomerAgentHoverContext';
import { LEFT_ALIGNED } from '../constants/WidgetLocations';
import styled from 'styled-components';
import { usePillLauncherExpandedViewInteractions } from '../../hooks/usePillLauncherExpandedViewInteractions';
import { jsx as _jsx } from "react/jsx-runtime";
const StyledWrapper = styled.div.withConfig({
  displayName: "InitialPageContentWrapper__StyledWrapper"
})(["display:flex;flex-direction:column;gap:8px;align-items:", ";margin:", ";"], ({
  widgetLocation
}) => widgetLocation === LEFT_ALIGNED ? 'flex-start' : 'flex-end', ({
  usePillLauncher,
  isMobile
}) => {
  if (isMobile) {
    return '0px';
  }
  if (usePillLauncher) {
    return '18px';
  }
  return '0px';
});
const InitialPageContentWrapper = ({
  children,
  widgetLocation,
  isMobile = false,
  usePillLauncher = false
}) => {
  const {
    setIsHoverActive,
    launcherRef
  } = useCustomerAgentHover();
  const {
    wrapperRef,
    interactionProps
  } = usePillLauncherExpandedViewInteractions({
    onOpenChange: setIsHoverActive,
    launcherRef
  });
  return /*#__PURE__*/_jsx(StyledWrapper, Object.assign({
    ref: wrapperRef,
    "data-test-id": "initial-page-content-wrapper"
  }, interactionProps, {
    widgetLocation: widgetLocation,
    isMobile: isMobile,
    usePillLauncher: usePillLauncher,
    children: children
  }));
};
InitialPageContentWrapper.displayName = 'InitialPageContentWrapper';
export default InitialPageContentWrapper;