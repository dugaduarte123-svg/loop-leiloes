export const withResolvers = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    promise,
    resolve,
    reject
  };
};
export const withTrackedResolvers = () => {
  const {
    promise,
    resolve,
    reject
  } = withResolvers();
  const tracked = promise;
  tracked._resolved = false;
  tracked._value = undefined;
  tracked._error = undefined;
  const trackedResolve = value => {
    tracked._resolved = true;
    tracked._value = value;
    resolve(value);
  };
  const trackedReject = error => {
    tracked._resolved = true;
    tracked._error = error;
    reject(error);
  };
  return {
    promise: tracked,
    resolve: trackedResolve,
    reject: trackedReject
  };
};
export const selectTrackedPromise = (source, selectedValue) => {
  const wrapper = new Promise((resolve, reject) => {
    source.then(resolve, reject).catch(reject);
  });
  wrapper._resolved = source._resolved;
  wrapper._value = selectedValue;
  wrapper._error = source._error;
  return wrapper;
};