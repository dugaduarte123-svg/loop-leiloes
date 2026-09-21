export const indexedMap = entries => {
  const map = new Map();
  const set = (firstId, secondId, value) => {
    const innerMap = map.get(firstId);
    if (innerMap) {
      innerMap.set(secondId, value);
    } else {
      map.set(firstId, new Map([[secondId, value]]));
    }
  };
  if (entries) {
    for (const [firstId, secondId, value] of entries) {
      set(firstId, secondId, value);
    }
  }
  return {
    get: (firstId, secondId) => {
      var _map$get;
      return (_map$get = map.get(firstId)) === null || _map$get === void 0 ? void 0 : _map$get.get(secondId);
    },
    set,
    delete: (firstId, secondId) => {
      const innerMap = map.get(firstId);
      innerMap === null || innerMap === void 0 || innerMap.delete(secondId);
      if ((innerMap === null || innerMap === void 0 ? void 0 : innerMap.size) === 0) {
        map.delete(firstId);
      }
    },
    getAll: firstId => map.get(firstId),
    deleteAll: firstId => {
      map.delete(firstId);
    },
    *[Symbol.iterator]() {
      for (const [firstId, innerMap] of map) {
        for (const [secondId, value] of innerMap) {
          yield [firstId, secondId, value];
        }
      }
    }
  };
};