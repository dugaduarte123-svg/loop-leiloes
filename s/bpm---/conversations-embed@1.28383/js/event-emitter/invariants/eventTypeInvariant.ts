import invariant from '../../utils/invariant';
import * as eventTypeConstants from '../constants/eventTypeConstants';
const eventTypeValues = Object.values(eventTypeConstants);
export const eventTypeInvariant = potentialEventType => invariant(eventTypeValues.indexOf(potentialEventType) !== -1, 'Expected a valid event type but received %s. Valid event types include %s.', potentialEventType, eventTypeValues);