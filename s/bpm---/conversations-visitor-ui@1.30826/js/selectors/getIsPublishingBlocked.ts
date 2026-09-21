// @ts-ignore untyped module
import { pubsubConnectionFailed } from '../pubsub/selectors/pubsubConnectionFailed';
// @ts-ignore untyped module
import { canPublish } from '../pubsub/selectors/canPublish';
export const getIsPublishingBlocked = state => pubsubConnectionFailed(state) || !canPublish(state);