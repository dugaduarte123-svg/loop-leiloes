export const emptyChangeContext = {
  changeId: -1,
  originId: -1,
  origin: 'empty',
  canCascade: true,
  optimistic: false
};
export const createChangeManager = ({
  devtools
} = {}) => {
  let nextChangeId = 1;
  return {
    start: (origin = 'empty', {
      optimistic = false
    } = {}) => {
      var _Error$stack;
      const id = nextChangeId++;
      const changeContext = {
        originId: id,
        changeId: id,
        origin,
        canCascade: true,
        optimistic
      };
      devtools === null || devtools === void 0 || devtools.traceOrigin(origin, changeContext, (_Error$stack = new Error().stack) === null || _Error$stack === void 0 ? void 0 : _Error$stack.split('\n').slice(0, 10).join('\n'));
      return changeContext;
    },
    cascade: from => ({
      changeId: nextChangeId++,
      originId: from.originId,
      origin: from.origin,
      canCascade: false,
      optimistic: from.optimistic
    }),
    next: from => ({
      changeId: nextChangeId++,
      originId: from.originId,
      origin: from.origin,
      canCascade: from.canCascade,
      optimistic: from.optimistic
    })
  };
};