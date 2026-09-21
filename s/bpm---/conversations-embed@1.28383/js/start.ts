import { startOnceReady } from './startOnceReady';
import { markStartPreDelay } from './perf/markStart';
markStartPreDelay();
const onDOMReady = () => {
  startOnceReady();
  document.removeEventListener('DOMContentLoaded', onDOMReady);
};
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onDOMReady);
} else {
  startOnceReady();
}