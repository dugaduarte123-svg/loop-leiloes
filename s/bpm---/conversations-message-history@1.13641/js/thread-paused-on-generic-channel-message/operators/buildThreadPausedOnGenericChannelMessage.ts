import { generateUuid } from '../../util/generateUuid';
import ThreadPausedOnGenericChannelMessage from '../records/ThreadPausedOnGenericChannelMessage';
export const buildThreadPausedOnGenericChannelMessage = (props = {}) => {
  const id = props.id || generateUuid();
  return new ThreadPausedOnGenericChannelMessage(Object.assign({}, props, {
    id
  }));
};