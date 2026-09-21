import { indexedSet } from '../../utils/indexedSet';
import { indexedMap } from '../../utils/indexedMap';
export const calculateTags = ({
  typeName,
  params,
  data,
  resourceRegistry
}) => {
  let linkTags = null;
  let contexts = null;
  resourceRegistry.forEachLink(typeName, edge => {
    const tagFn = data !== undefined ? edge.tagData : edge.tags;
    if (!tagFn) {
      return;
    }
    const results = tagFn({
      data,
      params
    });
    if (!results || results.length === 0) {
      return;
    }
    const linkKey = edge.link.key;
    for (const result of results) {
      if (typeof result === 'string') {
        var _linkTags;
        ((_linkTags = linkTags) !== null && _linkTags !== void 0 ? _linkTags : linkTags = indexedSet()).add(linkKey, result);
      } else {
        var _linkTags2, _contexts;
        ((_linkTags2 = linkTags) !== null && _linkTags2 !== void 0 ? _linkTags2 : linkTags = indexedSet()).add(linkKey, result.tag);
        ((_contexts = contexts) !== null && _contexts !== void 0 ? _contexts : contexts = indexedMap()).set(linkKey, result.tag, result.context);
      }
    }
  });
  return {
    tags: linkTags,
    contexts
  };
};