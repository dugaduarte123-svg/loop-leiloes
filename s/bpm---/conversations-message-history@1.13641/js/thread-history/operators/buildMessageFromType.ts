import { deserialize } from '../../common-message/serializers/messageSerializer';
export const buildMessageFromType = message => {
  return deserialize({
    json: message
  });
};