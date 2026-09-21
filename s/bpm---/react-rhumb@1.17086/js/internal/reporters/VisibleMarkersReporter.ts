import BaseReporter from './BaseReporter';
import { PageLoadMetrics } from '../Metrics';
import { isReload, isHashNavigation } from '../navigation';
import { getIsAiCopilotEnabled } from '../aiCopilot';
export default class VisibleMarkersReporter extends BaseReporter {
  report(action) {
    switch (action.type) {
      case 'NO_VISIBLE_MARKERS':
        {
          const {
            extra: {
              scenario
            }
          } = action.payload;
          PageLoadMetrics.counter('no-visible-markers', {
            scenario,
            isAiCopilotEnabled: String(getIsAiCopilotEnabled()),
            hasHash: String(isHashNavigation()),
            isReload: String(isReload())
          }).increment();
          break;
        }
      default:
        break;
    }
  }
}