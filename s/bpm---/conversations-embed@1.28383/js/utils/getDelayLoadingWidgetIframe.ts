import { PILL, DEFAULT } from 'conversations-internal-schema/widget-data/constants/launcherTypes';
export const getDelayLoadingWidgetIframe = (widgetData, mobile) => {
  const {
    message
  } = widgetData;
  const {
    popOpenWelcomeMessage,
    popOpenWidget,
    popMessageOnSmallScreens,
    clientTriggers,
    launcherType
  } = message;
  const {
    displayOnTimeDelay
  } = clientTriggers;
  const {
    enabled,
    timeDelaySeconds
  } = displayOnTimeDelay;
  const timeDelay = timeDelaySeconds * 1000;
  const isPillLauncher = (widgetData.routingRuleDefinitionAI || widgetData.systemChatflow) && (launcherType === PILL || launcherType === DEFAULT);
  if (mobile) {
    return {
      shouldDelayLoadingIframe: !popMessageOnSmallScreens && enabled &&
      // This additional override allows you to disable the delay in showing the mobile launcher
      !window.ONLY_53_DISPLAY_LAUNCHER_ON_MOBILE,
      timeDelay
    };
  }
  return {
    shouldDelayLoadingIframe: !isPillLauncher && !popOpenWidget && !popOpenWelcomeMessage && enabled,
    timeDelay
  };
};