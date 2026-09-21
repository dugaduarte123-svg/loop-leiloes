export const createGroupManager = ({
  logger
} = {}) => {
  const groups = new Map();
  return {
    has: group => groups.has(group),
    get: group => {
      const members = groups.get(group);
      return members ? new Set(members.keys()) : undefined;
    },
    add: (group, instanceKey) => {
      var _members$get;
      let members = groups.get(group);
      if (!members) {
        members = new Map();
        groups.set(group, members);
      }
      members.set(instanceKey, ((_members$get = members.get(instanceKey)) !== null && _members$get !== void 0 ? _members$get : 0) + 1);
      logger === null || logger === void 0 || logger.debug('added to group', {
        group,
        instanceKey
      });
    },
    remove: (group, instanceKey) => {
      const members = groups.get(group);
      if (!members) {
        return;
      }
      const count = members.get(instanceKey);
      if (count == null) {
        return;
      }
      if (count <= 1) {
        members.delete(instanceKey);
        if (members.size === 0) {
          groups.delete(group);
        }
      } else {
        members.set(instanceKey, count - 1);
      }
      logger === null || logger === void 0 || logger.debug('removed from group', {
        group,
        instanceKey
      });
    },
    getAllMembers: () => {
      const result = {};
      for (const [group, members] of groups) {
        result[group] = [...members.keys()];
      }
      return result;
    }
  };
};