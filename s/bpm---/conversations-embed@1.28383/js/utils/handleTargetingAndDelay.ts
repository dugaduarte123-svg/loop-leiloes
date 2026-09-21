import { isAnyMobile } from './whichDevice';
import { getWidgetDataResponseType } from '../operators/getWidgetDataResponseType';
import { HIDE_WIDGET } from '../constants/widgetResponseTypes';
import { getDelayLoadingWidgetIframe } from './getDelayLoadingWidgetIframe';
import { EVENTS } from '../events';
import { markEndPreDelay } from '../perf/markEnd';
import { markStartPostDelay } from '../perf/markStart';
export const handleTargetingAndDelay = (setWidgetData, loadIFrame, setWidgetNotLoaded) => {
  return widgetData => {
    const hideWidget = getWidgetDataResponseType(widgetData) === HIDE_WIDGET;
    const initialize = !hideWidget && !!widgetData.sessionId;
    if (initialize) {
      const {
        shouldDelayLoadingIframe,
        timeDelay
      } = getDelayLoadingWidgetIframe(widgetData, isAnyMobile());
      markEndPreDelay();
      if (shouldDelayLoadingIframe) {
        setTimeout(() => {
          setWidgetData(widgetData);
          markStartPostDelay();
          loadIFrame();
        }, timeDelay);
      } else {
        setWidgetData(widgetData);
        markStartPostDelay();
        loadIFrame();
      }
    } else {
      const {
        description,
        reason
      } = widgetData.metadata || {};
      setWidgetNotLoaded({
        description,
        reason
      });
    }
    EVENTS.messagesInitialized({
      messageWillRender: initialize
    });
  };
};