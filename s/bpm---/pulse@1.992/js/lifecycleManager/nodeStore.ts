import { create } from 'event-emitter';
export const createNodeStore = ({
  devtools
}) => {
  const nodes = new Map();
  const emitters = new Map();
  const getEmitter = instanceKey => {
    const emitter = emitters.get(instanceKey);
    if (!emitter) {
      throw new Error(`No emitter for ${instanceKey}`);
    }
    return emitter;
  };
  return {
    nodes,
    get: instanceKey => nodes.get(instanceKey),
    getEmitter,
    create: (instanceKey, entry) => {
      nodes.set(instanceKey, entry);
      const emitter = create();
      emitters.set(instanceKey, emitter);
      return emitter;
    },
    set: (instanceKey, entry) => {
      nodes.set(instanceKey, entry);
      devtools === null || devtools === void 0 || devtools.onStateChange(instanceKey, entry);
    },
    patch: (instanceKey, entry) => {
      nodes.set(instanceKey, entry);
    },
    remove: instanceKey => {
      nodes.delete(instanceKey);
      emitters.delete(instanceKey);
    }
  };
};