import { NavMarker } from 'react-rhumb';
import { isSucceeded, isFailed } from '../../constants/asyncStatuses';
import { jsx as _jsx } from "react/jsx-runtime";
const Checker = ({
  startOpen,
  widgetDataAsyncData,
  threadsAsyncData
}) => {
  const requestsToCheck = [widgetDataAsyncData];
  if (startOpen) {
    requestsToCheck.push(threadsAsyncData);
  }
  const anyFailed = requestsToCheck.some(asyncData => isFailed(asyncData));
  const allSucceeded = requestsToCheck.every(asyncData => isSucceeded(asyncData));
  if (anyFailed) {
    return /*#__PURE__*/_jsx(NavMarker, {
      name: "VISITOR_ERROR"
    });
  } else if (allSucceeded) {
    return /*#__PURE__*/_jsx(NavMarker, {
      name: "VISITOR_SUCCESS"
    });
  } else {
    return null;
  }
};
Checker.displayName = 'Checker';
export default Checker;