import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
const INITIAL_LAUNCHER_HEIGHT = 300;
const defaultValue = {
  launcherHeight: 0,
  setLauncherHeight: () => {}
};
const SpotlightLayoutContext = /*#__PURE__*/createContext(defaultValue);
SpotlightLayoutContext.displayName = 'SpotlightLayoutContext';
export const useSpotlightLayout = () => useContext(SpotlightLayoutContext);
export const SpotlightLayoutProvider = ({
  children
}) => {
  const [launcherHeight, setLauncherHeightState] = useState(INITIAL_LAUNCHER_HEIGHT);
  const setLauncherHeight = useCallback(height => setLauncherHeightState(Math.ceil(height)), []);
  const value = useMemo(() => ({
    launcherHeight,
    setLauncherHeight
  }), [launcherHeight, setLauncherHeight]);
  return /*#__PURE__*/_jsx(SpotlightLayoutContext.Provider, {
    value: value,
    children: children
  });
};
SpotlightLayoutProvider.displayName = 'SpotlightLayoutProvider';
export default SpotlightLayoutContext;