import { toSuccess } from '../../resolvers/definition/resolverState';
import { produceNext } from '../../utils/immer';
const noContexts = () => [];
export const pushFromData = transform => ({
  dataChanged,
  self,
  other,
  getContexts
}) => {
  var _self$state, _other$state;
  if (((_self$state = self.state) === null || _self$state === void 0 ? void 0 : _self$state.data) === undefined || !dataChanged) {
    return;
  }
  const selfData = self.state.data;
  const data = produceNext((_other$state = other.state) === null || _other$state === void 0 ? void 0 : _other$state.data, draft => transform({
    self: {
      data: selfData,
      params: self.params,
      context: self.context
    },
    other: {
      data: draft,
      params: other.params,
      context: other.context
    },
    getContexts: getContexts !== null && getContexts !== void 0 ? getContexts : noContexts
  }));
  if (data !== undefined) {
    return toSuccess(data)();
  }
};
export const pushFromDataImmutable = transform => ({
  dataChanged,
  self,
  other,
  getContexts
}) => {
  var _self$state2, _other$state2;
  if (((_self$state2 = self.state) === null || _self$state2 === void 0 ? void 0 : _self$state2.data) === undefined || !dataChanged) {
    return;
  }
  const data = transform({
    self: {
      data: self.state.data,
      params: self.params,
      context: self.context
    },
    other: {
      data: (_other$state2 = other.state) === null || _other$state2 === void 0 ? void 0 : _other$state2.data,
      params: other.params,
      context: other.context
    },
    getContexts: getContexts !== null && getContexts !== void 0 ? getContexts : noContexts
  });
  if (data !== undefined) {
    return toSuccess(data)();
  }
};
export const pullFromData = transform => ({
  dataChanged,
  self,
  other,
  getContexts
}) => {
  var _other$state3, _self$state3;
  if (((_other$state3 = other.state) === null || _other$state3 === void 0 ? void 0 : _other$state3.data) === undefined || !dataChanged) {
    return;
  }
  const otherData = other.state.data;
  const data = produceNext((_self$state3 = self.state) === null || _self$state3 === void 0 ? void 0 : _self$state3.data, draft => transform({
    self: {
      data: draft,
      params: self.params,
      context: self.context
    },
    other: {
      data: otherData,
      params: other.params,
      context: other.context
    },
    getContexts: getContexts !== null && getContexts !== void 0 ? getContexts : noContexts
  }));
  if (data !== undefined) {
    return toSuccess(data)();
  }
};
export const pullFromDataImmutable = transform => ({
  dataChanged,
  self,
  other,
  getContexts
}) => {
  var _other$state4, _self$state4;
  if (((_other$state4 = other.state) === null || _other$state4 === void 0 ? void 0 : _other$state4.data) === undefined || !dataChanged) {
    return;
  }
  const data = transform({
    self: {
      data: (_self$state4 = self.state) === null || _self$state4 === void 0 ? void 0 : _self$state4.data,
      params: self.params,
      context: self.context
    },
    other: {
      data: other.state.data,
      params: other.params,
      context: other.context
    },
    getContexts: getContexts !== null && getContexts !== void 0 ? getContexts : noContexts
  });
  if (data !== undefined) {
    return toSuccess(data)();
  }
};