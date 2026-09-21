export const indexedSet = entries => {
  const map = new Map();
  let size = 0;
  const add = (id, value) => {
    const current = map.get(id);
    if (current) {
      const sizeBefore = current.size;
      current.add(value);
      if (sizeBefore < current.size) {
        size++;
      }
    } else {
      map.set(id, new Set([value]));
      size++;
    }
  };
  const del = (id, value) => {
    const set = map.get(id);
    const didDelete = set === null || set === void 0 ? void 0 : set.delete(value);
    if (!didDelete) {
      return;
    }
    if ((set === null || set === void 0 ? void 0 : set.size) === 0) {
      map.delete(id);
    }
    size--;
  };
  if (entries) {
    for (const [id, value] of entries) {
      add(id, value);
    }
  }
  return {
    size: () => size,
    has: (id, value) => {
      var _map$get$has, _map$get;
      return (_map$get$has = (_map$get = map.get(id)) === null || _map$get === void 0 ? void 0 : _map$get.has(value)) !== null && _map$get$has !== void 0 ? _map$get$has : false;
    },
    get: id => map.get(id),
    add,
    delete: del,
    entries: () => map.entries(),
    *[Symbol.iterator]() {
      for (const [id, set] of map) {
        for (const value of set) {
          yield [id, value];
        }
      }
    }
  };
};