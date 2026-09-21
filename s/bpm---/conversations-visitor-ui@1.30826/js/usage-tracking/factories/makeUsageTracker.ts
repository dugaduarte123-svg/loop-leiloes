import { createContainer } from 'usage-tracker-multi';
import PortalIdParser from 'PortalIdParser';
const {
  createTracker
} = createContainer({
  storeUuidOnUrl: false
});
export function makeUsageTracker({
  messagesUtk
}) {
  return createTracker({
    standalone: true,
    trackerType: messagesUtk ? 'public' : 'anonymous',
    properties: {
      hubId: PortalIdParser.get(),
      // HACK!!! internally, usage-tracker splits the hstc on "." and takes the second item
      hstc: messagesUtk ? `.${messagesUtk}` : null
    }
  });
}