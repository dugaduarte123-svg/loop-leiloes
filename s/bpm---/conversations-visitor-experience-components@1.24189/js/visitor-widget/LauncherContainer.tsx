import PillLauncher from './PillLauncher';
import Launcher from './Launcher';
import { jsx as _jsx } from "react/jsx-runtime";
const LauncherContainer = props => {
  if (props.usePillLauncher) return /*#__PURE__*/_jsx(PillLauncher, Object.assign({}, props));
  return /*#__PURE__*/_jsx(Launcher, Object.assign({}, props));
};
LauncherContainer.displayName = 'LauncherContainer';
export default LauncherContainer;