import { throttleInProductInitialMessagePopups } from '../utils/throttleInProductInitialMessagePopups';
import { getExternalApiSettings } from '../external-api/getExternalApiSettings';
import { getIframeQueryParams } from '../utils/getIframeQueryParams';
import { WIDGET_DATA } from '../iframe-communication/constants/sentPostMessageTypes';
export const sendWidgetDataToIframe = ({
  source,
  widgetData,
  embedScriptContext,
  apiUsageTracker
}) => {
  const {
    notificationAudio
  } = getExternalApiSettings();
  source.postMessage(JSON.stringify({
    type: WIDGET_DATA,
    data: Object.assign({}, widgetData, getIframeQueryParams(embedScriptContext), {
      // These items are currently available in external api settings
      // but should be moved to widgetData in the future.
      notificationAudio
    })
  }), '*');
  throttleInProductInitialMessagePopups(embedScriptContext);
  apiUsageTracker.trackSettingsUsed(getExternalApiSettings());
};