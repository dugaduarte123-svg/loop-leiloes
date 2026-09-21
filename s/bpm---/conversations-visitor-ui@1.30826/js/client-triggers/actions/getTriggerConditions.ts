import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
import { shouldOverrideTrigger } from '../operators/shouldOverrideTrigger';
import { getWidgetStartOpen } from '../../widget-ui/selectors/getWidgetStartOpen';
import { getPopOpenWidget } from '../../selectors/widgetDataSelectors/getPopOpenWidget';
import { getIsMobile } from '../../selectors/getIsMobile';
//@ts-ignore untyped file
import { hasClientTriggerAlreadyFired as clientTriggerAlreadyFired } from '../operators/hasClientTriggerAlreadyFired';
import { getShouldHideWelcomeMessage } from '../../selectors/getShouldHideWelcomeMessage';
export const getTriggerConditions = (state, triggerEnabledFn) => {
  const widgetData = getLatestWidgetData(state);
  const shouldNotOverrideTrigger = !shouldOverrideTrigger(getWidgetStartOpen(state));
  const hasClientTriggerAlreadyFired = clientTriggerAlreadyFired(state);
  const shouldToggleOpen = triggerEnabledFn(widgetData) && getPopOpenWidget(state) && !getIsMobile(state) && shouldNotOverrideTrigger;
  const shouldToggleInitialMessageBubble = triggerEnabledFn(widgetData) && !getShouldHideWelcomeMessage(state);
  return {
    hasClientTriggerAlreadyFired,
    shouldToggleOpen,
    shouldToggleInitialMessageBubble
  };
};