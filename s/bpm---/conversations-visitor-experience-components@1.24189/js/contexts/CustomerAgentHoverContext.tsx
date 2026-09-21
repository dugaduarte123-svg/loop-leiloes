import { createContext, useContext, useState, useRef, useCallback } from 'react';
import { useMeasureNaturalWidth } from 'visitor-ui-component-library/utils/hooks/useMeasureNaturalWidth';
import { MIN_LAUNCHER_WIDTH } from '../visitor-widget/constants/launcherDimensions';
import { jsx as _jsx } from "react/jsx-runtime";
const CustomerAgentHoverContext = /*#__PURE__*/createContext(undefined);
//This context gives us easy access to controlling the hover state and passing it down to the components that need it.
export const CustomerAgentHoverProvider = ({
  children,
  enableHoverTracking
}) => {
  const HOVER_TIMEOUT = 300;
  const [isHoverActive, setIsHoverActive] = useState(false);
  const [naturalLauncherWidth, setNaturalLauncherWidth] = useState(0);
  const [hoverReady, setHoverReady] = useState(false);
  const timeoutRef = useRef(null);
  const {
    contentRef: launcherRef
  } = useMeasureNaturalWidth(() => [enableHoverTracking], {
    onMeasured: width => {
      setNaturalLauncherWidth(width);
      setHoverReady(true);
    }
  });
  const setIsHoverActiveWithDelay = useCallback(hovered => {
    if (!enableHoverTracking) {
      return;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (hovered) {
      setIsHoverActive(true);
    } else {
      timeoutRef.current = setTimeout(() => {
        setIsHoverActive(false);
        timeoutRef.current = null;
      }, HOVER_TIMEOUT);
    }
  }, [enableHoverTracking, HOVER_TIMEOUT]);
  const resetHoverState = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsHoverActive(false);
  }, []);
  const reducedLauncherWidth = Math.max(naturalLauncherWidth, MIN_LAUNCHER_WIDTH);
  return /*#__PURE__*/_jsx(CustomerAgentHoverContext.Provider, {
    value: {
      isHoverActive,
      setIsHoverActive: setIsHoverActiveWithDelay,
      resetHoverState,
      reducedLauncherWidth,
      launcherRef,
      hoverReady
    },
    children: children
  });
};
CustomerAgentHoverProvider.displayName = 'CustomerAgentHoverProvider';
export const useCustomerAgentHover = () => {
  const context = useContext(CustomerAgentHoverContext);
  if (context === undefined) {
    throw new Error('Hover must be used within a HoverProvider');
  }
  return context;
};