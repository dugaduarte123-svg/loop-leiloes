import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
// @ts-ignore Untyped import
import { getTargetScrollPercentage } from '../operators/getTargetScrollPercentage';
// @ts-ignore Untyped import
import { executeScrollTrigger } from '../../client-triggers/actions/executeScrollTrigger';
export const handleScrollPercentageChange = ({
  scrollPercentage
}) => (dispatch, getState) => {
  const widgetData = getLatestWidgetData(getState());
  if (scrollPercentage >= getTargetScrollPercentage(widgetData)) {
    dispatch(executeScrollTrigger());
  }
};