import { create } from 'event-emitter';
import { calculateTags } from '../links/discovery/calculateTags';
import { parseTypeName } from '../resources/resource';
import { establishEdge } from './establishEdge';
const tagChannel = (linkKey, tag) => `${linkKey}::${tag}`;
const breakerKey = (a, b, tag) => {
  const [first, second] = a < b ? [a, b] : [b, a];
  return `link::${first}::${second}::${tag}`;
};
export const createLinkManager = ({
  nodeStore,
  resourceRegistry,
  onInvalidated,
  onChange,
  schedule,
  scheduleInvalidation,
  logger,
  devtools
}) => {
  const breaker = create();
  const tagBus = create();
  const tagPresenceTeardown = create();
  function syncTags(instanceKey, changeContext) {
    var _dataResult$tags;
    const node = nodeStore.get(instanceKey);
    if (!node) {
      return;
    }
    tagPresenceTeardown.emit(instanceKey, changeContext);
    const typeName = parseTypeName(instanceKey);
    const hasData = node.state.data !== undefined;
    const dataResult = hasData ? calculateTags({
      typeName,
      params: node.meta.params,
      data: node.state.data,
      resourceRegistry
    }) : null;
    const paramTags = node.meta.paramLinkTags;
    const dataTags = (_dataResult$tags = dataResult === null || dataResult === void 0 ? void 0 : dataResult.tags) !== null && _dataResult$tags !== void 0 ? _dataResult$tags : null;

    // Retain the data-derived tags + per-tag contexts on the node. Computed
    // here every change anyway; link propagation reads it back to reconstruct
    // the full set of matched contexts between two instances (see establishEdge),
    // and it's dropped automatically when the entry is GC'd.
    node.meta.dataLinkTags = dataResult;
    if (!paramTags && !dataTags) {
      return;
    }
    const processTag = (linkKey, tag) => {
      var _dataResult$contexts, _devtools$onTagAdded;
      const channel = tagChannel(linkKey, tag);
      const myContext = dataResult === null || dataResult === void 0 || (_dataResult$contexts = dataResult.contexts) === null || _dataResult$contexts === void 0 ? void 0 : _dataResult$contexts.get(linkKey, tag);
      const arrivalEvent = {
        type: 'arrive',
        instanceKey,
        context: myContext,
        changeContext
      };
      tagBus.emit(channel, arrivalEvent);
      const busOff = tagBus.on(channel, event => {
        if (event.type === 'arrive') {
          handleMatch({
            instanceKey,
            neighborKey: event.instanceKey,
            tag,
            changeContext: event.changeContext,
            myContext,
            theirContext: event.context
          });
        } else {
          var _devtools$onLinkRemov;
          breaker.emit(breakerKey(instanceKey, event.instanceKey, tag));
          devtools === null || devtools === void 0 || (_devtools$onLinkRemov = devtools.onLinkRemoved) === null || _devtools$onLinkRemov === void 0 || _devtools$onLinkRemov.call(devtools, instanceKey, event.instanceKey, event.changeContext);
        }
      });
      const teardownOff = tagPresenceTeardown.on(instanceKey, removalContext => {
        var _devtools$onTagRemove;
        busOff();
        tagBus.emit(channel, Object.assign({}, arrivalEvent, {
          type: 'depart',
          changeContext: removalContext
        }));
        devtools === null || devtools === void 0 || (_devtools$onTagRemove = devtools.onTagRemoved) === null || _devtools$onTagRemove === void 0 || _devtools$onTagRemove.call(devtools, instanceKey, linkKey, tag, removalContext);
        teardownOff();
      });
      devtools === null || devtools === void 0 || (_devtools$onTagAdded = devtools.onTagAdded) === null || _devtools$onTagAdded === void 0 || _devtools$onTagAdded.call(devtools, instanceKey, linkKey, tag, changeContext);
    };
    if (paramTags) {
      for (const [linkKey, tag] of paramTags) {
        processTag(linkKey, tag);
      }
    }
    if (dataTags) {
      for (const [linkKey, tag] of dataTags) {
        processTag(linkKey, tag);
      }
    }
  }
  const subscriptionContext = {
    nodeStore,
    schedule,
    scheduleInvalidation,
    onInvalidated,
    onChange,
    logger,
    devtools
  };
  function handleMatch({
    instanceKey,
    neighborKey,
    tag,
    changeContext,
    myContext,
    theirContext
  }) {
    var _devtools$onLinkAdded;
    const myType = parseTypeName(instanceKey);
    const neighborType = parseTypeName(neighborKey);
    const edge = resourceRegistry.getLinkInfo(myType, neighborType);
    if (!edge) {
      return;
    }
    const myHash = resourceRegistry.getResourceFromTypeName(myType).hash;
    const theirHash = resourceRegistry.getResourceFromTypeName(neighborType).hash;
    const cleanupOutgoing = establishEdge(subscriptionContext, neighborKey, instanceKey, edge.outgoing, theirHash, myContext, theirContext);
    const cleanupIncoming = establishEdge(subscriptionContext, instanceKey, neighborKey, edge.incoming, myHash, theirContext, myContext);
    const breakerOff = breaker.on(breakerKey(instanceKey, neighborKey, tag), () => {
      cleanupOutgoing();
      cleanupIncoming();
      breakerOff();
    });
    devtools === null || devtools === void 0 || (_devtools$onLinkAdded = devtools.onLinkAdded) === null || _devtools$onLinkAdded === void 0 || _devtools$onLinkAdded.call(devtools, instanceKey, neighborKey, edge.outgoing.behavior, edge.incoming.behavior, changeContext);
  }
  return {
    syncTags,
    removeInstance: (instanceKey, changeContext) => {
      tagPresenceTeardown.emit(instanceKey, changeContext);
    }
  };
};