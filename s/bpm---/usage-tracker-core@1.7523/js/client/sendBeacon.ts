import { lWindow } from '../common/helpers';
import { hasBeaconSupport, hasLocationApi } from './browserHelper';
import reportError from './reportError';
const sendBeacon = (url, events, onFailure = () => {}) => {
  let scheduled = false;
  const isBeaconDisabled =
  // Allows to pragmatically forcefully disable Beacon features.
  // @TODO: This should become a config option in the future. But since in general,
  // we shouldn't allow users to disable Beacon features, this is for the time being
  // an internal undocumented feature.
  !hasLocationApi || lWindow.location.search.includes('disableBeacon=true');

  // If there's no Beacon support we want to by default fallback to `onFailure`
  if (hasBeaconSupport && !isBeaconDisabled) {
    try {
      // We stringify the EvenHts on a different line as both `new Blob` and `JSON.stringify`
      // can throw an Error and it's good to differentiate these lines
      const stringifiedEvents = JSON.stringify(events);

      // Creates a XHR compatible Body based on a Blob Object (ReadableStream)
      // For a text/plain stream that is compatible with the Beacon API endpoint
      const requestBody = new Blob([stringifiedEvents], {
        type: 'text/plain'
      });

      // Navigator has to be bound to ensure it does not error in some browsers
      // https://xgwang.me/posts/you-may-not-know-beacon/#it-may-throw-error%2C-be-sure-to-catch
      const sendBeaconAPI = lWindow.navigator.sendBeacon.bind(lWindow.navigator);

      // Send the request through the Navigator Beacon API. This is an asynchronous operation
      // and the browser will handle the request in the background.
      scheduled = sendBeaconAPI(url, requestBody);
    } catch (err) {
      // Beacon API can fail for numerous reasons on edge cases, such as boths
      // and we are already binding the Navigator API, hence if this fails
      // there's nothing else we can do here
      // Note.: For all browsers these will be TypeErrors
      if (err instanceof Error && err.name !== 'TypeError') {
        // We do nothing here if the schedule function gives an error
        // It could happen either because of JSON.stringify or navigator.sendBeacon failing
        // We attempt to report the Error anyways to Sentry as it'be interesting to know why
        reportError(err);
      }
    }
  }

  /*
   * From w3 beacon spec -
   *
   * The user agent imposes limits on the amount of data that can be sent via this API:
   * this helps ensure that such requests are delivered successfully and with minimal impact
   * on other user and browser activity. If the amount of data to be queued exceeds the user agent limit,
   * this method returns false; a return value of true implies the browser has queued the data for transfer.
   * However, since the actual data transfer happens asynchronously,
   * this method does not provide any information whether the data transfer has succeeded or not.
   */
  if (!scheduled && typeof onFailure === 'function') {
    onFailure();
  }
  return scheduled;
};
export default sendBeacon;