import { parseTypeName } from './resource';
import { create } from 'event-emitter';
import { indexedMap } from '../utils/indexedMap';
const wrapHandler = (handler, selfIsParent) => handler && (opts => handler({
  dataChanged: opts.dataChanged,
  flagsChanged: opts.flagsChanged,
  self: selfIsParent ? opts.parent : opts.child,
  other: selfIsParent ? opts.child : opts.parent,
  getContexts: () => opts.getContexts().map(c => selfIsParent ? {
    self: c.parent,
    other: c.child
  } : {
    self: c.child,
    other: c.parent
  })
}));
export const resolveEdges = link => ({
  push: {
    linkKey: link.key,
    behavior: link.pushBehavior,
    resolve: wrapHandler(link.onPush, true)
  },
  pull: {
    linkKey: link.key,
    behavior: link.pullBehavior,
    resolve: wrapHandler(link.onPull, false)
  }
});
export const createResourceRegistry = () => {
  const nodes = new Map();
  const edges = indexedMap();
  const emitter = create();
  const visitLinks = (typeName, visitor) => {
    const outgoing = edges.getAll(typeName);
    if (outgoing) {
      for (const metadata of outgoing.values()) {
        visitor(metadata);
      }
    }
  };
  const addLink = (registeringResource, link) => {
    var _link$tagParams, _link$tagData, _link$tagParams2, _link$tagData2;
    const {
      selfTypeName,
      otherTypeName
    } = link;
    const {
      push,
      pull
    } = resolveEdges(link);
    edges.set(selfTypeName, otherTypeName, {
      link,
      registeringResource,
      tags: (_link$tagParams = link.tagParams) === null || _link$tagParams === void 0 ? void 0 : _link$tagParams.self,
      tagData: (_link$tagData = link.tagData) === null || _link$tagData === void 0 ? void 0 : _link$tagData.self,
      outgoing: push,
      incoming: pull
    });
    edges.set(otherTypeName, selfTypeName, {
      link,
      registeringResource,
      tags: (_link$tagParams2 = link.tagParams) === null || _link$tagParams2 === void 0 ? void 0 : _link$tagParams2.other,
      tagData: (_link$tagData2 = link.tagData) === null || _link$tagData2 === void 0 ? void 0 : _link$tagData2.other,
      outgoing: pull,
      incoming: push
    });
  };
  const removeLink = link => {
    const {
      selfTypeName,
      otherTypeName
    } = link;
    edges.delete(selfTypeName, otherTypeName);
    edges.delete(otherTypeName, selfTypeName);
  };
  const registerResource = (resource, links = []) => {
    const priorLinks = [];
    visitLinks(resource.typeName, ({
      registeringResource,
      link
    }) => {
      if (registeringResource === resource.typeName) {
        priorLinks.push(link);
      }
    });
    nodes.set(resource.typeName, resource);
    const newKeys = new Set(links.map(l => l.key));
    const priorKeys = new Set(priorLinks.map(l => l.key));
    let removed = null;
    for (const prior of priorLinks) {
      if (!newKeys.has(prior.key)) {
        var _removed;
        removeLink(prior);
        ((_removed = removed) !== null && _removed !== void 0 ? _removed : removed = []).push(prior);
      }
    }
    let added = null;
    for (const link of links) {
      addLink(resource.typeName, link);
      if (!priorKeys.has(link.key)) {
        var _added;
        ((_added = added) !== null && _added !== void 0 ? _added : added = []).push(link);
      }
    }
    if (added || removed || priorLinks.length > 0) {
      emitter.emit('schemaChange', {
        added,
        removed,
        typeName: resource.typeName
      });
    }
  };
  const getResourceFromTypeName = typeName => {
    const def = nodes.get(typeName);
    if (!def) {
      throw new Error(`Resource ${typeName} not found in registry`);
    }
    return def;
  };
  const serialize = () => ({
    nodes: [...nodes].map(([id, data]) => ({
      id,
      data
    })),
    edges: [...edges].map(([sourceId, targetId, metadata]) => ({
      sourceId,
      targetId,
      metadata
    }))
  });
  return {
    emitter,
    serialize,
    getLinkInfo: (selfTypeName, otherTypeName) => edges.get(selfTypeName, otherTypeName),
    forEachLink: visitLinks,
    getResourceFromTypeName,
    getResource: instanceKey => getResourceFromTypeName(parseTypeName(instanceKey)),
    getAllResources: () => Object.fromEntries(nodes),
    registerResource
  };
};
export let defaultResourceRegistry = createResourceRegistry();
export const __testOnly_resetDefaultRegistry = () => {
  defaultResourceRegistry = createResourceRegistry();
};